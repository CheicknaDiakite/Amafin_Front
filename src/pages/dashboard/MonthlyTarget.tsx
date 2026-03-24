import { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Box, CircularProgress, Typography, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import { getObjectifs, Objectif } from "../../api/objectif";

/**
 * Synthèse dashboard : progression basée sur les **objectifs financiers**
 * (même source que la page Objectifs — API `getObjectifs`).
 */
export default function MonthlyTarget() {
  const [objectifs, setObjectifs] = useState<Objectif[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getObjectifs();
        if (!cancelled) setObjectifs(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("MonthlyTarget — objectifs", e);
        if (!cancelled) setError("Impossible de charger les objectifs.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const { totalCible, totalAtteint, safePercent, chartValue, primaryColor } = useMemo(() => {
    const cible = objectifs.reduce((s, o) => s + Number(o.montant_cible || 0), 0);
    // On utilise le montant_net s'il est fourni par l'API, sinon on le calcule
    const atteint = objectifs.reduce((s, o) => {
      const net = o.montant_net ?? (Number(o.montant_atteint ?? 0) - Number(o.total_depenses ?? 0));
      return s + net;
    }, 0);
    const rawPercent = cible > 0 ? (atteint / cible) * 100 : 0;
    const clampedDisplay = Math.round(Math.min(999, Math.max(-100, rawPercent)) * 100) / 100;
    const arcVal = Math.max(0, Math.min(100, rawPercent));
    let color = "#039855";
    if (rawPercent < 30) color = "#D92D20";
    else if (rawPercent < 70) color = "#F79009";
    else color = "#039855";
    return {
      totalCible: cible,
      totalAtteint: atteint,
      safePercent: clampedDisplay,
      chartValue: arcVal,
      primaryColor: color,
    };
  }, [objectifs]);

  const series = [chartValue];

  const options: ApexOptions = {
    colors: [primaryColor],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: 600,
            offsetY: -40,
            color: "#1D2939",
            formatter: function () {
              return `${safePercent}%`;
            },
          },
        },
      },
    },
    fill: { type: "solid", colors: [primaryColor] },
    stroke: { lineCap: "round" },
    labels: ["Progression"],
  };

  const fmt = (v: number) =>
    v.toLocaleString("fr-FR", { maximumFractionDigits: 0 });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 280,
          borderRadius: 2,
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!objectifs.length || totalCible <= 0) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, textAlign: "center" }}>
        <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>
          Objectifs financiers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Aucun objectif avec un montant cible n&apos;est défini. Créez vos objectifs pour suivre votre
          progression ici.
        </Typography>
        <MuiLink component={Link} to="/objectif" underline="hover" fontWeight={600}>
          Gérer les objectifs →
        </MuiLink>
      </Box>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 sm:px-6 sm:pt-6">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-800">Objectifs financiers</h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400 text-sm">
              Progression globale sur{" "}
              <span className="font-semibold text-gray-700">
                {objectifs.length} objectif{objectifs.length > 1 ? "s" : ""}
              </span>{" "}
              (
              <span style={{ color: primaryColor, fontWeight: 700 }}>{safePercent}%</span> de la cible totale)
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px]" id="chartObjectifsRadial">
            <Chart options={options} series={series} type="radialBar" height={330} />
          </div>

          <span
            className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: safePercent >= 70 ? "rgba(3,152,85,0.08)" : "rgba(247,144,9,0.12)",
              color: primaryColor,
            }}
          >
            {safePercent >= 100 ? "Objectif atteint" : `${fmt(totalAtteint)} / ${fmt(totalCible)} FCFA`}
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Indicateur basé sur la somme des montants atteints et des montants cibles de vos objectifs financiers
          (identique à la page Objectifs).
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5 flex-wrap">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs sm:text-sm">
            Montant atteint
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg">
            {fmt(totalAtteint)} FCFA
          </p>
        </div>

        <div className="hidden sm:block w-px bg-gray-200 h-7 dark:bg-gray-800 shrink-0" />

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs sm:text-sm">
            Montant cible (total)
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 sm:text-lg">
            {fmt(totalCible)} FCFA
          </p>
        </div>
      </div>
    </div>
  );
}

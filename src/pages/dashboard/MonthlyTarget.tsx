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
      height: 200,
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
            fontSize: "24px",
            fontWeight: 600,
            offsetY: -30,
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
    <div className="rounded-2xl border bg-gray-300 dark:bg-white/[0.03]">
      <div className="px-3 pt-3 bg-white shadow-default rounded-2xl pb-6 sm:px-5 sm:pt-5">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            {/* <h3 className="text-lg font-semibold text-gray-800">Objectifs financiers</h3> */}
            <p className="mt-1 text-gray-900 text-theme-sm dark:text-gray-900 text-sm">
              Progression globale (
              <span style={{ color: primaryColor, fontWeight: 700 }}>{safePercent}%</span>)
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[200px]" id="chartObjectifsRadial">
            <Chart options={options} series={series} type="radialBar" height={200} />
          </div>

        </div>

      </div>

      <div className="flex flex-col items-start gap-1 px-3 py-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-700 font-semibold">{fmt(totalAtteint)} FCFA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="text-xs text-gray-500">{fmt(totalCible)} F</span>
        </div>
      </div>
    </div>
  );
}

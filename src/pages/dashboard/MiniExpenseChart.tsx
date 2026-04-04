import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useGetSumDepense } from '../../usePerso/fonction.entre';
import ShowChartIcon from '@mui/icons-material/ShowChart';

/**
 * MiniExpenseChart — Area chart compact (colonne xs=6 mobile)
 * Affiche l'évolution des dépenses mensuelles avec ApexCharts.
 */
export default function MiniExpenseChart() {
  const { depensesSum, isLoading, isError } = useGetSumDepense();

  const { labels, values, total, trend, isUp } = useMemo(() => {
    const rows = depensesSum ?? [];
    const lbs = rows.map((d) => {
      // Abrège "janvier 2026" → "jan."
      const parts = d.mois.trim().split(' ');
      return parts[0]?.slice(0, 3) ?? d.mois;
    });
    const vals = rows.map((d) => Number(d.total) || 0);
    const tot = vals.reduce((s, v) => s + v, 0);
    const last = vals[vals.length - 1] ?? 0;
    const prev = vals[vals.length - 2] ?? 0;
    const up = last >= prev;
    const pct =
      prev > 0 ? Math.round(Math.abs(((last - prev) / prev) * 100)) : 0;
    return { labels: lbs, values: vals, total: tot, trend: pct, isUp: up };
  }, [depensesSum]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError || values.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <ShowChartIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
        <Typography variant="caption" color="text.disabled">
          Aucune donnée
        </Typography>
      </Box>
    );
  }

  const options: ApexOptions = {
    chart: {
      type: 'area',
      sparkline: { enabled: true },
      animations: { enabled: true, speed: 600 },
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 2.5,
      colors: ['#7c3aed'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.02,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: '#7c3aed', opacity: 0.45 },
          { offset: 100, color: '#7c3aed', opacity: 0.02 },
        ],
      },
    },
    markers: {
      size: 0,
      hover: { size: 5, sizeOffset: 2 },
    },
    tooltip: {
      enabled: true,
      x: { show: true },
      y: {
        formatter: (v: number) =>
          `${v.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA`,
      },
      theme: 'dark',
    },
    xaxis: {
      categories: labels,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    dataLabels: { enabled: false },
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Résumé chiffré */}
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Typography
          sx={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}
        >
          {total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
        </Typography>
        <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled', fontWeight: 600 }}>
          FCFA total
        </Typography>
        {/* Badge tendance */}
        <Box
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.3, mt: 0.8,
            px: 1, py: 0.3, borderRadius: 999,
            bgcolor: isUp ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
            color: isUp ? '#DC2626' : '#059669',
            fontSize: '0.62rem', fontWeight: 700,
          }}
        >
          {isUp ? '↑' : '↓'} {trend}%
        </Box>
      </Box>
      {/* Graphique area */}
      <Chart
        options={options}
        series={[{ name: 'Dépenses', data: values }]}
        type="area"
        height={90}
        width="100%"
      />
    </Box>
  );
}

import { BarChart } from '@mui/x-charts/BarChart';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useGetSumDepense } from '../../usePerso/fonction.entre';

function formatMontant(n: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);
}

export default function MonthlyBarChart() {
  const { depensesSum, isLoading, isError } = useGetSumDepense();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Impossible de charger les dépenses par mois.</Alert>;
  }

  const rows = depensesSum ?? [];
  /** Mois en bas (ex. « janvier 2026 », « février 2026 ») — API renvoie déjà le libellé français */
  const xLabels = rows.map((d) => d.mois.trim());
  const values = rows.map((d) => Number(d.total) || 0);

  if (rows.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Aucune dépense enregistrée pour l&apos;instant.</Typography>
      </Box>
    );
  }

  const manyMonths = xLabels.length > 5;

  return (
    <Box sx={{ width: '100%', minHeight: 380 }}>
      <BarChart
        height={360}
        margin={{ top: 36, right: 16, bottom: manyMonths ? 72 : 56, left: 56 }}
        series={[
          {
            id: 'depenses',
            type: 'bar',
            label: 'Montant',
            data: values,
            color: '#3b82f6',
            valueFormatter: (value) =>
              value == null ? '' : `${formatMontant(value)} FCFA`,
          },
        ]}
        xAxis={[
          {
            scaleType: 'band',
            data: xLabels,
            tickLabelStyle: {
              fontSize: 11,
              angle: manyMonths ? -35 : 0,
              textAnchor: manyMonths ? 'end' : 'middle',
            },
          },
        ]}
        yAxis={[
          {
            valueFormatter: (value) => formatMontant(value as number),
          },
        ]}
        barLabel={(item) => (item.value != null ? formatMontant(item.value) : '')}
        tooltip={{ trigger: 'item' }}
        slotProps={{
          barLabel: {
            style: {
              fontSize: 11,
              fontWeight: 600,
              fill: '#1e3a5f',
            },
          },
        }}
      />
    </Box>
  );
}

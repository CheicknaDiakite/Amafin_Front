import { useStockEntreprise } from '../../usePerso/fonction.user';
import { useStoreUuid } from '../../usePerso/store';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SimpleCharts() {
  const theme = useTheme();

  const uuid = useStoreUuid((state) => state.selectedId);
  const { stockEntreprise, isLoading, isError } = useStockEntreprise(uuid || '');

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="error">Problème de connexion !</Alert>
      </Stack>
    );
  }

  if (stockEntreprise?.details_sortie_par_mois) {
    const monthlyData = stockEntreprise.details_sortie_par_mois as unknown as Record<string, { somme_qte: number; somme_prix_total: string; }>;
    const chartData = Object.entries(monthlyData).map(([month, data]) => ({
      month: new Date(month).toLocaleString('default', { month: 'short', year: '2-digit' }),
      value: data.somme_qte || 0,
    }));

    // Trier les données par date réelle
    chartData.sort((a, b) => {
      // On retransforme en date complète pour trier
      const monthNames = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
      const parseMonth = (m: string) => {
        const [mois, annee] = m.split(' ');
        const monthIndex = monthNames.indexOf(mois);
        return new Date(2000 + parseInt(annee, 10), monthIndex);
      };
      return parseMonth(a.month).getTime() - parseMonth(b.month).getTime();
    });

    // Prendre les 12 derniers mois
    const last12Months = chartData.slice(-12);

    return (
      <Card
        sx={{
          height: '100%',
          backgroundColor: 'background.paper',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(0, 0, 0, 0.1)}`,
        }}
      >
        <CardHeader
          title="Quantités totales sorties par mois (12 derniers mois)"
          sx={{
            color: 'text.primary',
            borderBottom: `1px solid rgba(0, 0, 0, 0.1)}`,
          }}
        />
        <CardContent>
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={last12Months}>
                <CartesianGrid strokeDasharray="3 3" stroke={'rgba(0, 0, 0, 0.1)'} />
                <XAxis dataKey="month" stroke={'rgba(0, 0, 0, 0.7)'} tick={{ fill: 'rgba(0, 0, 0, 0.7)' }} />
                <YAxis stroke={'rgba(0, 0, 0, 0.7)'} tick={{ fill: 'rgba(0, 0, 0, 0.7)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: `1px solid rgba(0, 0, 0, 0.1)}`, color: 'text.primary' }} />
                <Bar dataKey="value" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return null;
}
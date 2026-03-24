import { Box, Grid, Typography, CircularProgress, Card, CardContent, CardHeader, useTheme } from '@mui/material';
import Nav from '../../../_components/Button/Nav';
import { useSortieUserEntreprise } from '../../../usePerso/fonction.user';
import { useStoreUuid } from '../../../usePerso/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Types
interface UserData {
  username: string;
  total_qte: number;
}

interface MonthlyData {
  month: string;
  details: UserData[];
}

const MAX_MONTHS_TO_DISPLAY = 12;

const MonthlyUserChart = ({ monthlyData }: { monthlyData: MonthlyData }) => {
  const theme = useTheme();

  const chartData = monthlyData.details.map((user: UserData) => ({
    name: user.username || 'Inconnu',
    value: user.total_qte || 0,
  }));

  // Trier les données par valeur décroissante
  const sortedChartData = chartData.sort((a, b) => b.value - a.value);

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
        title={`${monthlyData.month}`}
        sx={{
          color: 'text.primary',
          borderBottom: `1px solid rgba(0, 0, 0, 0.1)}`,
        }}
      />
      <CardContent>
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer>
            <BarChart data={sortedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={'rgba(0, 0, 0, 0.1)'} />
              <XAxis 
                dataKey="name" 
                stroke={'rgba(0, 0, 0, 0.7)'}
                tick={{ fill: 'rgba(0, 0, 0, 0.7)' }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke={'rgba(0, 0, 0, 0.7)'} tick={{ fill: 'rgba(0, 0, 0, 0.7)' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: `1px solid rgba(0, 0, 0, 0.1)}`, color: 'text.primary' }} />
              <Bar dataKey="value" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function VenteUsers() {
  const uuid = useStoreUuid((state) => state.selectedId);
  
  const { sortiesUser, isLoading } = useSortieUserEntreprise(uuid!);

  const monthlyData = sortiesUser?.mensuel_par_utilisateur as MonthlyData[] || [];
  const hasData = monthlyData.length > 0;

  return (
    <>
      <Nav />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h1" gutterBottom>
            Statistiques des ventes par utilisateur et par mois
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : !hasData ? (
            <Typography
              variant="h6"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              Aucune donnée de vente disponible pour le moment.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {monthlyData
                .slice(-MAX_MONTHS_TO_DISPLAY) // Prendre les 12 derniers mois
                .map((monthlyData: MonthlyData, index: number) => (
                  <Grid item xs={12} md={6} lg={4} key={`${monthlyData.month}-${index}`}>
                    <MonthlyUserChart monthlyData={monthlyData} />
                  </Grid>
                ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}

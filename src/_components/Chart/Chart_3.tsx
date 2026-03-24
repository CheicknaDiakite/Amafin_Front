import { useFetchEntreprise, useSortieUserEntreprise } from '../../usePerso/fonction.user';
import { useStoreUuid } from '../../usePerso/store';
import { 
  Box,
  Card, 
  CardContent, 
  CardHeader,
  useTheme, 
  CircularProgress,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserData {
  username: string | null;
  total_qte: number;
}

interface MonthlyData {
  month: string;
  details: UserData[];
}

export default function Chart_3() {
  const theme = useTheme();
  const uuid = useStoreUuid((state) => state.selectedId);
  const { unEntreprise  } = useFetchEntreprise(uuid);
  const { sortiesUser } = useSortieUserEntreprise(uuid!);
  
  if (!uuid || !unEntreprise) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (sortiesUser) {
    // Récupérer le mois le plus récent
    const monthlyData = sortiesUser.mensuel_par_utilisateur as MonthlyData[];
    const latestMonth = monthlyData[monthlyData.length - 1];
    console.log('Données du mois le plus récent:', sortiesUser);

    if (!latestMonth) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    const chartData = latestMonth.details.map((user: UserData) => ({
      name: user.username || 'Inconnu',
      value: user.total_qte || 0,
    }));

    // Trier les données par valeur décroissante et prendre les 15 premiers
    const topChartData = chartData
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);

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
          title={`Quantités totales vendues par utilisateur - ${latestMonth.month}`}
          sx={{
            color: 'text.primary',
            borderBottom: `1px solid rgba(0, 0, 0, 0.1)}`,
          }}
        />
        <CardContent>
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={topChartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={'rgba(0, 0, 0, 0.1)'} 
                />
                <XAxis 
                  dataKey="name" 
                  stroke={'rgba(0, 0, 0, 0.7)'}
                  tick={{ fill: 'rgba(0, 0, 0, 0.7)' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  stroke={'rgba(0, 0, 0, 0.7)'}
                  tick={{ fill: 'rgba(0, 0, 0, 0.7)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: `1px solid rgba(0, 0, 0, 0.1)}`,
                    color: 'text.primary',
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill={theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );
}

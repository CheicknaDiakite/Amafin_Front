import { useGetSumDepense } from '../../usePerso/fonction.entre';
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

interface DepenseSumType {
  mois: string;
  total: number;
}

export default function Chart_Dep() {
  const theme = useTheme()
  const uuid = useStoreUuid((state) => state.selectedId);
  const { depensesSum, isLoading, isError } = useGetSumDepense(1);
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
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

  if (depensesSum && Array.isArray(depensesSum)) {
    const chartData = (depensesSum as DepenseSumType[]).slice(0, 12).map((item) => ({
      name: item.mois
        ? new Date(item.mois).toLocaleString('default', { month: 'short' })
        : 'Inconnu',
      value: item.total || 0,
    }));

    return (
      <Card 
        sx={{ 
          height: '100%',
          backgroundColor: 'background.paper' ,
          // 'rgba(0, 0, 0, 0.7)'
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(0, 0, 0, 0.1)`,
          // 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardHeader
          title="Dépenses mensuelles"
          sx={{
            color: 'text.primary',
            // 'text.primary'
            borderBottom: `1px solid rgba(0, 0, 0, 0.1)}`,
            // 'rgba(0, 0, 0, 0.1)'
          }}
        />
        <CardContent>
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={ 'rgba(0, 0, 0, 0.1)'} 
                  // 'rgba(0, 0, 0, 0.1)'
                />
                <XAxis 
                  dataKey="name" 
                  stroke={'rgba(0, 0, 0, 0.7)'}
                  // 'rgba(0, 0, 0, 0.7)'
                  tick={{ fill: 'rgba(0, 0, 0, 0.7)' }}
                  // 'rgba(0, 0, 0, 0.7)'
                />
                <YAxis 
                  stroke={ 'rgba(0, 0, 0, 0.7)' }
                  // 'rgba(0, 0, 0, 0.7)'
                  tick={{ fill: 'rgba(0, 0, 0, 0.7)' }}
                  // 'rgba(0, 0, 0, 0.7)'
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    // 'rgba(255, 255, 255, 0.8)'
                    border: `1px solid rgba(0, 0, 0, 0.1)}`,
                    // 'rgba(0, 0, 0, 0.1)'
                    color: 'text.primary',
                    // 'text.primary'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill={ theme.palette.primary.main }
                  // theme.palette.primary.main
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return null;
}

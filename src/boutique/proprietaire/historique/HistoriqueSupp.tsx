import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { useHistorySuppEntreprise } from '../../../usePerso/fonction.user';
import { useStoreUuid } from '../../../usePerso/store';
import { formatNumberWithSpaces } from '../../../usePerso/fonctionPerso';
import Nav from '../../../_components/Button/Nav';
import { HistoriqueType } from '../../../typescript/Account';

// Components
const LoadingSpinner = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px' 
  }}>
    <CircularProgress />
  </Box>
);

const ErrorMessage = () => (
  <Stack sx={{ width: '100%', padding: 2 }} spacing={2}>
    <Alert 
      severity="error"
      sx={{ 
        '& .MuiAlert-message': { 
          fontSize: '1rem' 
        } 
      }}
    >
      Une erreur est survenue lors de la récupération des données.
    </Alert>
  </Stack>
);

const EmptyState = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: 4,
      backgroundColor: '#f9fafb'
    }}
  >
    <Typography variant="body1" color="text.secondary">
      Aucun historique de suppression disponible
    </Typography>
  </Box>
);

const HistoryTable = ({ data }: { data: HistoriqueType[] }) => (
  <TableContainer 
    component={Paper} 
    elevation={0}
    sx={{ 
      borderRadius: 2,
      overflow: 'hidden'
    }}
  >
    <Table 
      sx={{ minWidth: 700 }} 
      aria-label="tableau historique des suppressions"
    >
      <TableHead>
        <TableRow>
          <TableCell 
            align="center" 
            colSpan={7}
            sx={{ 
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Typography variant="h6" component="h2">
                Historique des produits supprimés
              </Typography>
              <Chip
                label={data.length}
                color="error"
                size="small"
                sx={{ 
                  fontWeight: 'medium',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  '& .MuiChip-label': {
                    px: 2
                  }
                }}
              />
            </Box>
          </TableCell>
        </TableRow>
        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
          <TableCell>Date</TableCell>
          <TableCell>Type</TableCell>
          <TableCell align="right">Quantité</TableCell>
          <TableCell align="right">Prix Unitaire</TableCell>
          <TableCell align="right">Libellé</TableCell>
          <TableCell align="right">Catégorie</TableCell>
          <TableCell align="right">Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow 
            key={`history-${index}`}
            hover
            sx={{ 
              '&:last-child td, &:last-child th': { 
                border: 0 
              }
            }}
          >
            <TableCell>
              {format(new Date(row.date ?? new Date()), 'dd/MM/yyyy HH:mm:ss')}
            </TableCell>
            <TableCell>
              <Chip
                label={row.type}
                size="small"
                sx={{
                  backgroundColor: row.type === 'entrer' ? '#dcfce7' : '#dbeafe',
                  color: row.type === 'entrer' ? '#15803d' : '#1e40af',
                  fontWeight: 'medium'
                }}
              />
            </TableCell>
            <TableCell align="right">{row.qte}</TableCell>
            <TableCell align="right">{formatNumberWithSpaces(row.pu)}</TableCell>
            <TableCell align="right">{row.libelle}</TableCell>
            <TableCell align="right">{row.categorie}</TableCell>
            <TableCell align="right">{row.action}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default function HistoriqueSupp() {
  const uuid = useStoreUuid((state) => state.selectedId);
  const { suppH, isLoading, isError } = useHistorySuppEntreprise(uuid!);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!suppH || suppH.length === 0) return <EmptyState />;

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Nav />
        <Box sx={{ mt: 6 }}>
          <HistoryTable data={suppH} />
        </Box>
      </div>
    </div>
  );
}


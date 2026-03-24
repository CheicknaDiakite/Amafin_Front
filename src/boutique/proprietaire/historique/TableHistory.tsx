import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Pagination,
  TextField,
  Stack
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { format } from 'date-fns';
import { useHistoriqueEntreprise } from '../../../usePerso/fonction.user';
import { connect } from '../../../_services/account.service';
import { EntrepriseType } from '../../../typescript/Account';
import Nav from '../../../_components/Button/Nav';
import { formatNumberWithSpaces } from '../../../usePerso/fonctionPerso';

// Types
interface HistoryRowProps {
  row: EntrepriseType;
}

type FilterType = 'all' | 'entrer' | 'sortie';

// Components
const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <CircularProgress />
  </Box>
);

const ErrorMessage = () => (
  <Stack sx={{ width: '100%', padding: 2 }} spacing={2}>
    <Alert severity="error">Une erreur est survenue lors de la récupération des données.</Alert>
  </Stack>
);

const FilterButtons = ({ currentFilter, onFilterChange }: { currentFilter: FilterType, onFilterChange: (filter: FilterType) => void }) => (
  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
    <Button
      variant={currentFilter === 'entrer' ? 'contained' : 'outlined'}
      onClick={() => onFilterChange('entrer')}
      color="primary"
    >
      Entrées
    </Button>
    <Button
      variant={currentFilter === 'sortie' ? 'contained' : 'outlined'}
      onClick={() => onFilterChange('sortie')}
      color="primary"
    >
      Sorties
    </Button>
    <Button
      variant={currentFilter === 'all' ? 'contained' : 'outlined'}
      onClick={() => onFilterChange('all')}
      color="primary"
    >
      Tous
    </Button>
  </Box>
);

const DateFilters = ({ startDate, endDate, onStartDateChange, onEndDateChange }: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
    <TextField
      label="Date de début"
      type="date"
      value={startDate}
      onChange={(e) => onStartDateChange(e.target.value)}
      InputLabelProps={{ shrink: true }}
      className="bg-white"
      fullWidth
    />
    <TextField
      label="Date de fin"
      type="date"
      value={endDate}
      onChange={(e) => onEndDateChange(e.target.value)}
      InputLabelProps={{ shrink: true }}
      className="bg-white"
      fullWidth
    />
  </Box>
);

const HistoryRow = ({ row }: HistoryRowProps) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const filteredHistorique = row.historique?.filter((historyRow) => {
    const typeFilter = filter === 'all' || historyRow.type === filter;
    const rowDate = new Date(historyRow.date ?? new Date());
    const isAfterStartDate = startDate ? rowDate >= new Date(startDate) : true;
    const isBeforeEndDate = endDate ? rowDate <= new Date(endDate) : true;
    return typeFilter && isAfterStartDate && isBeforeEndDate;
  });

  const totalPages = Math.ceil((filteredHistorique?.length ?? 0) / rowsPerPage);
  const paginatedHistorique = filteredHistorique?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label={open ? 'Réduire les détails' : 'Voir les détails'}
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon color="primary" /> : <KeyboardArrowDownIcon color="primary" />}
          </IconButton>
        </TableCell>
        <TableCell>{row.nom}</TableCell>
        <TableCell align="right">{row.adresse}</TableCell>
        <TableCell align="right">{row.numero}</TableCell>
        <TableCell align="right">{row.email}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" component="h3">
                  Historique
                  <span className="ml-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    {filteredHistorique?.length ?? 0}
                  </span>
                </Typography>
              </div>

              <FilterButtons currentFilter={filter} onFilterChange={setFilter} />
              <DateFilters
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />

              <TableContainer component={Paper} elevation={0}>
                <Table size="small" aria-label="historique des transactions">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                      <TableCell align="right">Prix unitaire</TableCell>
                      <TableCell align="right">Libellé</TableCell>
                      <TableCell align="right">Catégorie</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedHistorique?.map((historyRow, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          {format(new Date(historyRow.date ?? new Date()), 'dd/MM/yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            historyRow.type === 'entrer' 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {historyRow.type}
                          </span>
                        </TableCell>
                        <TableCell align="right">{historyRow.qte}</TableCell>
                        <TableCell align="right">{formatNumberWithSpaces(historyRow.pu)}</TableCell>
                        <TableCell align="right">{historyRow.libelle}</TableCell>
                        <TableCell align="right">{historyRow.categorie}</TableCell>
                        <TableCell align="right">{historyRow.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function TableHistory() {
  const { historique, isLoading, isError } = useHistoriqueEntreprise(connect);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!historique) return null;

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Nav />
        <Paper elevation={0} className="mt-6">
          <TableContainer>
            <Table aria-label="tableau des entreprises">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell />
                  <TableCell>Nom de l'entreprise</TableCell>
                  <TableCell align="right">Adresse</TableCell>
                  <TableCell align="right">Téléphone</TableCell>
                  <TableCell align="right">Email</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historique.map((row, index) => (
                  <HistoryRow key={`${row.nom}-${index}`} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
}

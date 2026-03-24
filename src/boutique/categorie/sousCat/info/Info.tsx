import { useParams } from "react-router-dom";
import { RecupType, RouteParams } from "../../../../typescript/DataType";
import { 
  Box, 
  Button,
  CircularProgress, 
  InputAdornment,
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CardInfo from "./CardInfo";
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Nav from "../../../../_components/Button/Nav";
import { useFetchSousCate, useInfoSousCate } from "../../../../usePerso/fonction.categorie";
import { formatNumberWithSpaces } from "../../../../usePerso/fonctionPerso";
import { useState } from "react";
import { useFetchUser } from "../../../../usePerso/fonction.user";
import { Pagination } from '@mui/material';
import '../mobile-souscat.css';

export default function Info() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { uuid } = useParams<RouteParams>();
  const { unUser } = useFetchUser();
  // const { sousCate } = useCateSousCate({ slug: uuid, user_id: connect });
  const {unSousCate} = useFetchSousCate(uuid!)
  const { infos, isLoading } = useInfoSousCate({ slug: uuid });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  const itemsPerPage = 25;

  const filteredInfos = infos?.filter((item) => {
    if (!item.date) return false;
    const itemDate = new Date(item.date).getTime();
    const startDate = selectedStartDate ? new Date(selectedStartDate).getTime() : null;
    const endDate = selectedEndDate ? new Date(selectedEndDate).getTime() : null;
    return (startDate === null || itemDate >= startDate) && (endDate === null || itemDate <= endDate);
  });

  const reversedInfos = filteredInfos?.slice().sort((a: RecupType, b: RecupType) => {
    if (a.id === undefined) return 1;
    if (b.id === undefined) return -1;
    return Number(b.id) - Number(a.id);
  });

  const totalPages = Math.ceil((reversedInfos?.length || 0) / itemsPerPage);
  const displayedInfos = reversedInfos?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const totalPrice = reversedInfos?.reduce((acc, row: RecupType) => {
    return acc + ((row.qte !== undefined && row.pu !== undefined) ? row.qte * row.pu : 0);
  }, 0) || 0;

  const totalQte = reversedInfos?.reduce((acc, row: RecupType) => {
    return acc + (row.qte !== undefined ? row.qte : 0);
  }, 0) || 0;

  const ent = infos?.filter(info => info.sortie !== undefined && info.sortie !== null)
    .flatMap(info => info.sortie);

  const sumQteStock = infos?.filter(info => info.libelle !== undefined)
    .reduce((sum, sor) => sum + (sor.qte || 0), 0) || 0;

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen mobile-loading">
        <CircularProgress size={isMobile ? 40 : 60} />
      </Box>
    );
  }

  if (!infos) return null;

  return (
    <div className={`min-h-screen ${isMobile ? '' : ''}`}>
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* {sousCate?.map((post, index) => ( */}
          <div className={`mb-8 ${isMobile ? 'mobile-header-container' : ''}`}>
            <Typography 
              variant="h4" 
              className={`font-semibold text-gray-900 ${isMobile ? 'mobile-title' : ''}`}
              sx={{ 
                fontSize: { xs: '1.75rem', sm: '2rem' },
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              {unSousCate.libelle}
            </Typography>
            <Typography 
              variant="body1" 
              className="text-gray-500 mt-1"
              sx={{ 
                fontSize: { xs: '0.9rem', sm: '1rem' },
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              Informations détaillées des ventes et du stock
            </Typography>
          </div>
        {/* ))} */}

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${isMobile ? 'mobile-grid' : ''}`}>
          <Paper 
            elevation={isMobile ? 1 : 0} 
            className={`p-6 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 mobile-stats-card`}
            sx={{ 
              borderRadius: isMobile ? '16px' : '8px',
              padding: { xs: '16px', sm: '24px' }
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <Typography 
                  variant="subtitle2" 
                  className="text-blue-600 mb-1"
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                >
                  Total des ventes
                </Typography>
                <Typography 
                  variant="h4" 
                  className="font-semibold"
                  sx={{ 
                    fontSize: { xs: '1.5rem', sm: '2rem' }
                  }}
                >
                  {sumQteStock}
                </Typography>
                <Typography 
                  variant="body2" 
                  className="text-gray-500 mt-1"
                  sx={{ 
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                >
                  {formatNumberWithSpaces(totalPrice)} F
                </Typography>
              </div>
              <div className="bg-blue-200 p-3 rounded-full mobile-stats-icon">
                <ShoppingCartIcon className="text-blue-600" />
              </div>
            </div>
          </Paper>

          {ent?.map((p, index) => {
            if (p.qte !== 0) {
              return (
                <Paper 
                  key={index} 
                  elevation={isMobile ? 1 : 0} 
                  className={`p-6 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 mobile-stats-card`}
                  sx={{ 
                    borderRadius: isMobile ? '16px' : '8px',
                    padding: { xs: '16px', sm: '24px' }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography 
                        variant="subtitle2" 
                        className="text-green-600 mb-1"
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        {p.libelle}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        className="font-semibold"
                        sx={{ 
                          fontSize: { xs: '1.5rem', sm: '2rem' }
                        }}
                      >
                        {p.qte}
                      </Typography>
                      {unUser.role === 1 && (
                        <Typography 
                          variant="body2" 
                          className="text-gray-500 mt-1"
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          Prix d'achat: {formatNumberWithSpaces(p.pu_achat)} F
                        </Typography>
                      )}
                    </div>
                    <div className="bg-green-200 p-3 rounded-full mobile-stats-icon">
                      <InventoryIcon className="text-green-600" />
                    </div>
                  </div>
                </Paper>
              );
            }
            return null;
          })}
        </div>

        <Paper 
          elevation={isMobile ? 1 : 0} 
          className={`border rounded-lg overflow-hidden mb-8 ${isMobile ? 'mobile-table-container' : ''}`}
          sx={{ 
            borderRadius: isMobile ? '16px' : '8px'
          }}
        >
          <div className={`p-4 border-b bg-gray-50 ${isMobile ? 'mobile-table-header' : ''}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <TextField
                  label="Date de début"
                  type="date"
                  value={selectedStartDate}
                  onChange={(e) => setSelectedStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  className={`bg-white ${isMobile ? 'mobile-date-field' : ''}`}
                  size="small"
                  sx={{
                    borderRadius: isMobile ? '12px' : '4px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: isMobile ? '12px' : '4px',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Date de fin"
                  type="date"
                  value={selectedEndDate}
                  onChange={(e) => setSelectedEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  className={`bg-white ${isMobile ? 'mobile-date-field' : ''}`}
                  size="small"
                  sx={{
                    borderRadius: isMobile ? '12px' : '4px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: isMobile ? '12px' : '4px',
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <Tooltip title="Nombre total de ventes" arrow TransitionComponent={Fade}>
                <Button
                  variant="outlined"
                  size="small"
                  className={isMobile ? 'mobile-button' : ''}
                  sx={{
                    borderRadius: isMobile ? '12px' : '4px',
                    fontWeight: isMobile ? 600 : 400
                  }}
                >
                  {displayedInfos.length} ventes
                </Button>
              </Tooltip>
            </div>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Date</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Client</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Produit</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Quantité</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Prix Unitaire</TableCell>
                  <TableCell align="right" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedInfos?.length > 0 ? (
                  displayedInfos.map((row, index) => (
                    <CardInfo key={index} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="py-8">
                      <Typography 
                        variant="body1" 
                        className="text-gray-500"
                        sx={{ 
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        Aucune donnée disponible
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={3} align="right" className="font-medium" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    Total :
                  </TableCell>
                  <TableCell align="right" className="font-medium" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {totalQte}
                  </TableCell>
                  <TableCell />
                  <TableCell align="right" className="font-medium" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    <div className="flex items-center justify-end gap-1">
                      {formatNumberWithSpaces(totalPrice)} F
                      <LocalAtmIcon className="text-blue-600" fontSize="small" />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <div className={`flex justify-center p-4 border-t ${isMobile ? 'mobile-pagination' : ''}`}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: isMobile ? '8px' : '4px',
                  }
                }}
              />
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
}

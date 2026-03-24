import { 
  Box, 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  IconButton, 
  Pagination, 
  Paper, 
  Skeleton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography,
  Tooltip,
  Fade
} from '@mui/material'
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from '@mui/icons-material/Add';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { connect } from '../../../../_services/account.service';
import { useCreateFacEntre, useGetAllFacEntre } from '../../../../usePerso/fonction.facture';
import CardFacEntre from './CardFacEntre';
import MyTextField from '../../../../_components/Input/MyTextField';
import { FacSorType } from '../../../../typescript/fac';
import Nav from '../../../../_components/Button/Nav';
import { useStoreUuid } from '../../../../usePerso/store';
import { RecupType } from '../../../../typescript/DataType';
import M_Abonnement from '../../../../_components/Card/M_Abonnement';
import { useFetchEntreprise } from '../../../../usePerso/fonction.user';
import { isLicenceExpired } from '../../../../usePerso/fonctionPerso';
import '../mobile-produit.css';

export default function FacEntre() {
  const uuid = useStoreUuid((state) => state.selectedId)
  const {unEntreprise} = useFetchEntreprise(uuid)
  const [isMobile, setIsMobile] = useState(false);

  const {ajoutFacEntre} = useCreateFacEntre()
  const {facEntresUtilisateur, isLoading, isError}= useGetAllFacEntre(connect, uuid!)

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 10 : 25;

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  const [selectedEndDate, setSelectedEndDate] = useState<string>('');

  const filteredBoutiques = facEntresUtilisateur?.filter((item) => {
    if (!item.date) return false;
    const itemDate = new Date(item.date).getTime();
    const startDate = selectedStartDate ? new Date(selectedStartDate).getTime() : null;
    const endDate = selectedEndDate ? new Date(selectedEndDate).getTime() : null;
    return (
      (startDate === null || itemDate >= startDate) &&
      (endDate === null || itemDate <= endDate)
    );
  });

  const reversedFacEntrer = filteredBoutiques?.slice().sort((a: RecupType, b: RecupType) => {
    if (a.id === undefined) return 1;
    if (b.id === undefined) return -1;
    return Number(b.id) - Number(a.id);
  });
 
  const totalPages = Math.ceil(filteredBoutiques.length / itemsPerPage);
  const facEntrerBoutic = reversedFacEntrer.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
   
  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStartDate(event.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEndDate(event.target.value);
    setCurrentPage(1);
  };
  
  const [open, openchange]= useState(false);
  const functionopen = () => openchange(true);
  const closeopen = () => openchange(false);

  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const [formValues, setFormValues] = useState<FacSorType>({
    user_id: '',
    libelle: '',
    ref: '',
    date: '',
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formValues["user_id"] = connect;
    formValues["facture"] = image;
    formValues["entreprise_id"] = uuid!;

    ajoutFacEntre(formValues);

    setFormValues({
      user_id: '',
      libelle: '',
      date: '',
      ref: '',
    });
    closeopen();
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', padding: isMobile ? 2 : 3 }}>
        <Skeleton height={60} className={isMobile ? 'mobile-loading' : ''} />
        <Skeleton height={40} className={isMobile ? 'mobile-loading' : ''} />
        <Skeleton height={400} className={isMobile ? 'mobile-loading' : ''} />
      </Box>
    );
  }

  if (isError) {
    window.location.reload();
    return <div>Erreur lors du chargement...</div>;
  }

  if (facEntresUtilisateur) {
    return (
      <div className={`min-h-screen ${isMobile ? '' : ''}`}>
        <Nav />
        
        <div className={`${isMobile ? 'px-4 py-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
          <div className={`${isMobile ? 'mobile-header-container' : 'mb-8 flex justify-between items-center'}`}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              className={`${isMobile ? 'mobile-title' : 'font-semibold text-gray-900'}`}
              sx={isMobile ? {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              } : {}}
            >
              Factures d'Entrée
            </Typography>
            <Tooltip title="Ajouter une facture" arrow TransitionComponent={Fade}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={functionopen}
                className={`${isMobile ? 'mobile-button mobile-button-primary' : 'bg-blue-600 hover:bg-blue-700'}`}
                sx={isMobile ? {
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    background: 'linear-gradient(135deg, #1d4ed8, #1e40af)'
                  }
                } : {}}
              >
                Nouvelle Facture
              </Button>
            </Tooltip>
          </div>

          <Paper 
            elevation={0} 
            className={`${isMobile ? 'mobile-filters-section' : 'mb-6 p-4 border rounded-lg'}`}
            sx={isMobile ? {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '16px',
              marginBottom: '16px',
              animation: 'slideInUp 0.6s ease-out'
            } : {}}
          >
            <Grid 
              container 
              spacing={isMobile ? 2 : 3} 
              alignItems="center"
              className={isMobile ? 'mobile-grid' : ''}
              sx={{
                '& .MuiGrid-item': {
                  padding: isMobile ? '8px' : '12px'
                }
              }}
            >
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" className={`${isMobile ? 'mb-2 text-gray-700' : 'mb-2 text-gray-700'}`}>
                  Filtrer par période
                </Typography>
                <Grid container spacing={isMobile ? 1 : 2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Date de début"
                      type="date"
                      value={selectedStartDate}
                      onChange={handleStartDateChange}
                      InputLabelProps={{ shrink: true }}
                      className={`${isMobile ? 'mobile-date-field' : 'bg-white'}`}
                      sx={isMobile ? {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:focus-within': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }
                        }
                      } : {}}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Date de fin"
                      type="date"
                      value={selectedEndDate}
                      onChange={handleEndDateChange}
                      InputLabelProps={{ shrink: true }}
                      className={`${isMobile ? 'mobile-date-field' : 'bg-white'}`}
                      sx={isMobile ? {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:focus-within': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                          }
                        }
                      } : {}}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6} className="flex justify-end">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  className={`${isMobile ? 'mobile-pagination' : 'mt-4 md:mt-0'}`}
                  sx={isMobile ? {
                    '& .MuiPaginationItem-root': {
                      borderRadius: '8px',
                      margin: '0 2px'
                    }
                  } : {}}
                />
              </Grid>
            </Grid>
          </Paper>

          <Dialog 
            open={open} 
            onClose={closeopen} 
            fullWidth 
            maxWidth="xs"
            PaperProps={{
              elevation: 0,
              className: "rounded-10",
              sx: isMobile ? {
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              } : {}
            }}
          >
            <DialogTitle className={`flex justify-between items-center bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white border-b pb-3`}>
              <Typography variant="h6">Ajouter une facture d'entrée</Typography>
              <IconButton onClick={closeopen} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            {isLicenceExpired(unEntreprise.licence_date_expiration) ? (
              <M_Abonnement />  
            ) : (        
              <DialogContent className={`${isMobile ? 'mobile-p-4' : 'mt-4'}`}>              
                <form onSubmit={onSubmit} className="space-y-4 p-2">
                  <MyTextField
                    required
                    fullWidth
                    label="Libellé"
                    name="libelle"
                    onChange={onChange}
                    className={`${isMobile ? 'mobile-form-field' : ''}`}
                    InputProps={{
                      startAdornment: <DescriptionIcon className="mr-2 text-gray-400" />,
                    }}
                    sx={isMobile ? {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:focus-within': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }
                      }
                    } : {}}
                  />
                  
                  <MyTextField
                    required
                    fullWidth
                    label="Référence"
                    name="ref"
                    onChange={onChange}
                    className={`${isMobile ? 'mobile-form-field' : ''}`}
                    InputProps={{
                      startAdornment: <ReceiptIcon className="mr-2 text-gray-400" />,
                    }}
                    sx={isMobile ? {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:focus-within': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }
                      }
                    } : {}}
                  />
                  
                  <MyTextField
                    required
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    onChange={onChange}
                    InputLabelProps={{ shrink: true }}
                    className={`${isMobile ? 'mobile-date-field' : ''}`}
                    InputProps={{
                      startAdornment: <DateRangeIcon className="mr-2 text-gray-400" />,
                    }}
                    sx={isMobile ? {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:focus-within': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }
                      }
                    } : {}}
                  />
                  
                  <MyTextField 
                    fullWidth
                    label="Facture"
                    name="facture"
                    type="file"
                    onChange={handleImageChange}
                    InputLabelProps={{ shrink: true }}
                    className={`${isMobile ? 'mobile-file-field' : ''}`}
                    InputProps={{
                      startAdornment: <ReceiptIcon className="mr-2 text-gray-400" />,
                    }}
                    sx={isMobile ? {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        border: '2px dashed rgba(59, 130, 246, 0.3)',
                        '&:focus-within': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          borderColor: 'rgba(59, 130, 246, 0.6)'
                        }
                      }
                    } : {}}
                  />
                  
                  <div className={`${isMobile ? 'mobile-action-buttons' : 'pt-4 border-t flex justify-end'}`}>
                    <Button
                      type="submit"
                      variant="contained"
                      className={`${isMobile ? 'mobile-button mobile-button-primary' : 'bg-blue-600 hover:bg-blue-700'}`}
                      sx={isMobile ? {
                        borderRadius: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                          background: 'linear-gradient(135deg, #1d4ed8, #1e40af)'
                        }
                      } : {}}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </DialogContent>
            )}
          </Dialog>
      
          <TableContainer 
            component={Paper} 
            elevation={0} 
            className={`${isMobile ? 'mobile-table-container' : 'border rounded-lg'}`}
            sx={isMobile ? {
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: '16px'
            } : {}}
          >
            <Table>
              <TableHead className={isMobile ? 'mobile-table-header' : 'bg-gray-50'}>
                <TableRow>
                  <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-semibold`}>Date</TableCell>
                  <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-semibold`}>Libellé</TableCell>
                  <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-semibold`}>Référence</TableCell>
                  <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-semibold`}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facEntrerBoutic?.length > 0 ? (
                  facEntrerBoutic?.map((row, index) => (
                    <CardFacEntre key={index} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" className={`${isMobile ? 'mobile-empty-card py-8' : 'py-8'} text-gray-500`}>
                      Aucune facture d'entrée disponible
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }
}

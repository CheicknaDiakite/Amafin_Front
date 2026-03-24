import { ChangeEvent, FormEvent, useState, useEffect, SyntheticEvent } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Pagination,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Card,
  CardContent,
  Alert,
  Autocomplete,
  MenuItem,
} from '@mui/material';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { connect } from '../../../_services/account.service';
import { DepenseType, RecupType } from '../../../typescript/DataType';
import { useCreateDepense, useUpdateDepense, useDeleteDepense, useGetAllDepense } from '../../../usePerso/fonction.entre';
import MyTextField from '../../../_components/Input/MyTextField';
import CardDepense from './CardDepense';
import { useStoreUuid } from '../../../usePerso/store';
import { formatNumberWithSpaces, isLicenceExpired } from '../../../usePerso/fonctionPerso';
import M_Abonnement from '../../../_components/Card/M_Abonnement';
import { useFetchEntreprise } from '../../../usePerso/fonction.user';
import Chart_Dep from '../../../_components/Chart/Chart_Dep';
import './mobile-produit.css';
import { useFetchAllSousCate } from '../../../usePerso/fonction.categorie';
import { getObjectifs, Objectif } from '../../../api/objectif';

export default function Depense() {
  const {ajoutDepense} = useCreateDepense();
  const {updateDepense} = useUpdateDepense();
  const {deleteDepense} = useDeleteDepense();
  const uuid = useStoreUuid((state) => state.selectedId);
  const {unEntreprise} = useFetchEntreprise(uuid);

  const {depensesEntreprise, isLoading, isError} = useGetAllDepense();
  console.log("depensesEntreprise ", uuid);
  
  const {souscategories} = useFetchAllSousCate()
  console.log("souscategories", souscategories)

  const [objectifsFinanciers, setObjectifsFinanciers] = useState<Objectif[]>([]);
  const [selectedObjectifId, setSelectedObjectifId] = useState<string>('');

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await getObjectifs();
        setObjectifsFinanciers(Array.isArray(list) ? list : []);
      } catch {
        setObjectifsFinanciers([]);
      }
    })();
  }, []);

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

  const filteredDepenses = depensesEntreprise?.filter((item: DepenseType) => {
    if (!item.date) return false;
    const itemDate = new Date(item.date).getTime();
    const startDate = selectedStartDate ? new Date(selectedStartDate).getTime() : null;
    const endDate = selectedEndDate ? new Date(selectedEndDate).getTime() : null;
    return (startDate === null || itemDate >= startDate) && (endDate === null || itemDate <= endDate);
  });

  const reversedDepenses = filteredDepenses?.slice().sort((a: DepenseType, b: DepenseType) => {
    if (a.id === undefined) return 1;
    if (b.id === undefined) return -1;
    return b.id - a.id;
  });

  const totalPages = Math.ceil((reversedDepenses?.length || 0) / itemsPerPage);
  const depensesBoutic = reversedDepenses?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalMontant = depensesBoutic?.reduce((acc: number, depense: DepenseType) => {
    const somme = depense.somme ? parseFloat(String(depense.somme)) : 0;
    return acc + somme;
  }, 0);

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

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDepense, setSelectedDepense] = useState<(DepenseType & { categorie_slug?: string }) | null>(null);
  const [toDeleteDepense, setToDeleteDepense] = useState<DepenseType | null>(null);

  const [formValues, setFormValues] = useState<DepenseType & { categorie_slug?: string }>({
    libelle: '',
    date: '',
    somme: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const handleAutoCompleteChange = (_: SyntheticEvent<Element, Event>, value: string | RecupType | null) => {
    if (typeof value === 'object' && value !== null) {
      setSelectedCategory(value.uuid ?? '');
    } else {
      setSelectedCategory('');
    }
  };

  const openEditModal = (depense: DepenseType & { categorie_slug?: string }) => {
    setSelectedDepense(depense);
    setFormValues({
      libelle: depense.libelle || '',
      date: depense.date || '',
      somme: depense.somme || 0,
      categorie_slug: depense.categorie_slug || '',
      objectif_id: depense.objectif_id ?? undefined,
    });
    setSelectedCategory(depense.categorie_slug || '');
    setSelectedObjectifId(depense.objectif_id != null ? String(depense.objectif_id) : '');
    setOpen(false);
    setEditOpen(true);
  };

  const closeEditModal = () => {
    setSelectedDepense(null);
    setFormValues({ libelle: '', date: '', somme: 0 });
    setSelectedObjectifId('');
    setEditOpen(false);
  };

  const openAddModal = () => {
    setFormValues({ libelle: '', date: '', somme: 0 });
    setSelectedCategory('');
    setSelectedObjectifId('');
    setOpen(true);
  };

  const openDeleteModal = (depense: DepenseType) => {
    setToDeleteDepense(depense);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setToDeleteDepense(null);
    setDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    if (toDeleteDepense) {
      deleteDepense(toDeleteDepense);
    }
    closeDeleteModal();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedObjectifId) {
      return;
    }
    const dataToSend = {
      ...formValues,
      user_id: connect,
      facture: image,
      categorie_slug: selectedCategory,
      objectif_id: Number(selectedObjectifId),
    };
    console.log("jjj", selectedDepense)
    if (selectedDepense) {
      updateDepense({
        ...selectedDepense,
        ...dataToSend,
      } as any);
      closeEditModal();
    } else {
      ajoutDepense(dataToSend);
      setFormValues({ libelle: '', date: '', somme: 0 });
      setSelectedObjectifId('');
      setOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Box className={`${isMobile ? 'mobile-p-4' : 'p-8'}`}>
        <Card elevation={0} className={isMobile ? 'mobile-header-container' : ''}>
          <CardContent>
            <div className={`${isMobile ? 'mobile-loading' : 'animate-pulse'} space-y-4`}>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className={`${isMobile ? 'mobile-p-4' : 'p-8'}`}>
        <Alert severity="error" className={isMobile ? 'mobile-alert' : ''}>
          Une erreur est survenue lors du chargement des données
        </Alert>
      </Box>
    );
  }

  if (depensesEntreprise) {
    return (
      <div className={`min-h-screen ${isMobile ? '' : '' } py-6`}>
        <div className={`${isMobile ? 'px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
          {/* <Nav /> */}
          <div className={isMobile ? 'mobile-chart-section' : ''}>
            <Chart_Dep />
          </div>
          <Paper 
            elevation={0} 
            className={`${isMobile ? 'mobile-header-container' : 'mt-6 rounded-lg overflow-hidden'}`}
            sx={isMobile ? {
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              marginTop: '24px'
            } : {}}
          >
            <Box className={`${isMobile ? 'mobile-p-4' : 'p-6'}`}>
              {/* Header */}
              <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-center'} border-b pb-6 mb-6`}>
                <div>
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
                    Gestion des Dépenses
                  </Typography>
                  <Typography variant="body2" className={`${isMobile ? 'text-gray-600 mt-2' : 'text-gray-500 mt-1'}`}>
                    Gérez les dépenses de votre entreprise
                  </Typography>
                </div>
                <Button
                  onClick={openAddModal}
                  variant="contained"
                  startIcon={<AddIcon />}
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
                  Ajouter une dépense
                </Button>
              </div>

              {/* Filters and Summary */}
              <div className={`${isMobile ? 'mobile-filters-section' : 'mb-6 space-y-4'}`}>
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
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Date de début"
                      type="date"
                      value={selectedStartDate}
                      onChange={handleStartDateChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRangeIcon className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
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
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Date de fin"
                      type="date"
                      value={selectedEndDate}
                      onChange={handleEndDateChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRangeIcon className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
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
                  <Grid item xs={12} md={4}>
                    <Paper 
                      elevation={0} 
                      className={`${isMobile ? 'mobile-stats-card' : 'p-4 bg-blue-50 border border-blue-100 rounded-lg'}`}
                      sx={isMobile ? {
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        animation: 'scaleIn 0.6s ease-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                        }
                      } : {}}
                    >
                      <Typography variant="subtitle2" className="text-blue-900 mb-1">
                        Total des dépenses
                      </Typography>
                      <Typography variant={isMobile ? "h5" : "h4"} className="text-blue-700 flex items-center">
                        {formatNumberWithSpaces(totalMontant)}
                        <LocalAtmIcon className={`${isMobile ? 'mobile-stats-icon' : ''} ml-2`} />
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </div>

              {/* Table */}
              <TableContainer 
                component={Paper} 
                elevation={0} 
                className={`${isMobile ? 'mobile-table-container' : 'border'}`}
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
                      <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-medium`}>Date</TableCell>
                      <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-medium`}>Libellé</TableCell>
                      <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-medium`}>Montant</TableCell>
                      <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-medium`}>Objectif</TableCell>
                      <TableCell className={`${isMobile ? 'mobile-table-cell' : ''} font-medium`}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {depensesBoutic?.length > 0 ? (
                      depensesBoutic.map((row: DepenseType, index: number) => (
                        <CardDepense key={index} row={row} onEdit={openEditModal} onDelete={openDeleteModal} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center" className={`${isMobile ? 'mobile-empty-card py-8' : 'py-8'} text-gray-500`}>
                          Aucune dépense enregistrée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <div className={`${isMobile ? 'mobile-pagination' : 'flex justify-center mt-6'}`}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  sx={isMobile ? {
                    '& .MuiPaginationItem-root': {
                      borderRadius: '8px',
                      margin: '0 2px'
                    }
                  } : {}}
                />
              </div>
            </Box>
          </Paper>

          {/* Add Expense Modal */}
          <Dialog 
            open={open} 
            onClose={() => setOpen(false)}
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
              <Typography variant="h6" className="font-semibold">
                Ajouter une dépense
              </Typography>
              <IconButton onClick={() => setOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            {isLicenceExpired(unEntreprise.licence_date_expiration) ? (
              <M_Abonnement />
            ) : (
              <DialogContent className={`${isMobile ? 'mobile-p-4' : 'mt-4'}`}>
                <form onSubmit={onSubmit} className="space-y-4">
                  {objectifsFinanciers.length === 0 && (
                    <Alert severity="warning">
                      Aucun objectif financier. Créez-en un dans le menu <strong>Objectifs</strong> avant
                      d&apos;enregistrer une dépense.
                    </Alert>
                  )}

                  <TextField
                    select
                    required
                    fullWidth
                    label="Objectif financier"
                    value={selectedObjectifId}
                    onChange={(e) => setSelectedObjectifId(e.target.value)}
                    disabled={objectifsFinanciers.length === 0}
                    helperText="Chaque dépense est rattachée à un objectif (suivi comme sur la page Objectifs)."
                  >
                    {objectifsFinanciers
                      .filter((o) => o.id != null)
                      .map((o) => (
                        <MenuItem key={o.id} value={String(o.id)}>
                          {o.nom}
                          {o.montant_cible != null ? ` — ${Number(o.montant_cible).toLocaleString('fr-FR')} FCFA` : ''}
                        </MenuItem>
                      ))}
                  </TextField>

                  <Autocomplete
                    id="categorie_slug"
                    freeSolo
                    options={souscategories}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.libelle || '')}
                    onChange={handleAutoCompleteChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Nom du produit"

                        sx={{
                          "& .MuiFormLabel-asterisk": { color: "red" },
                        }}
                      />
                    )}
                  />
                  <MyTextField
                    required
                    fullWidth
                    label="Libellé"
                    name="libelle"
                    onChange={(e) => setFormValues({...formValues, libelle: e.target.value})}
                    value={formValues.libelle}
                    className={`${isMobile ? 'mobile-form-field' : 'bg-white'}`}
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
                    type="date"
                    label="Date"
                    name="date"
                    onChange={(e) => setFormValues({...formValues, date: e.target.value})}
                    value={formValues.date}
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

                  <MyTextField
                    required
                    fullWidth
                    type="number"
                    label="Montant"
                    name="somme"
                    onChange={(e) => setFormValues({...formValues, somme: parseFloat(e.target.value)})}
                    value={formValues.somme}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalAtmIcon className="text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    className={`${isMobile ? 'mobile-form-field' : 'bg-white'}`}
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

                  {/* <MyTextField
                    fullWidth
                    type="file"
                    label="Facture"
                    onChange={handleImageChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ReceiptIcon className="text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    className={`${isMobile ? 'mobile-file-field' : 'bg-white'}`}
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
                  /> */}

                  <div className={`${isMobile ? 'mobile-action-buttons' : 'flex justify-end space-x-2'} pt-4`}>
                    <Button 
                      onClick={() => setOpen(false)} 
                      variant="outlined"
                      className={isMobile ? 'mobile-button' : ''}
                      sx={isMobile ? {
                        borderRadius: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
                        }
                      } : {}}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={objectifsFinanciers.length === 0 || !selectedObjectifId}
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
                      Ajouter
                    </Button>
                  </div>
                </form>
              </DialogContent>
            )}
          </Dialog>

          {/* Edit Expense Modal */}
          <Dialog
            open={editOpen}
            onClose={closeEditModal}
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
              <Typography variant="h6" className="font-semibold">
                Modifier la dépense
              </Typography>
              <IconButton onClick={closeEditModal} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent className={`${isMobile ? 'mobile-p-4' : 'mt-4'}`}>
              <form onSubmit={onSubmit} className="space-y-4">
                <TextField
                  select
                  required
                  fullWidth
                  label="Objectif financier"
                  value={selectedObjectifId}
                  onChange={(e) => setSelectedObjectifId(e.target.value)}
                  disabled={objectifsFinanciers.length === 0}
                >
                  {objectifsFinanciers
                    .filter((o) => o.id != null)
                    .map((o) => (
                      <MenuItem key={o.id} value={String(o.id)}>
                        {o.nom}
                        {o.montant_cible != null ? ` — ${Number(o.montant_cible).toLocaleString('fr-FR')} FCFA` : ''}
                      </MenuItem>
                    ))}
                </TextField>

                <Autocomplete
                  id="categorie_slug_edit"
                  freeSolo
                  options={souscategories}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.libelle || '')}
                  onChange={handleAutoCompleteChange}
                  value={souscategories.find(cat => cat.uuid === selectedCategory) || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Nom du produit"
                      sx={{
                        "& .MuiFormLabel-asterisk": { color: "red" },
                      }}
                    />
                  )}
                />
                <MyTextField
                  required
                  fullWidth
                  label="Libellé"
                  name="libelle"
                  onChange={(e) => setFormValues({...formValues, libelle: e.target.value})}
                  value={formValues.libelle}
                  className={`${isMobile ? 'mobile-form-field' : 'bg-white'}`}
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
                  type="date"
                  label="Date"
                  name="date"
                  onChange={(e) => setFormValues({...formValues, date: e.target.value})}
                  value={formValues.date}
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

                <MyTextField
                  required
                  fullWidth
                  type="number"
                  label="Montant"
                  name="somme"
                  onChange={(e) => setFormValues({...formValues, somme: parseFloat(e.target.value)})}
                  value={formValues.somme}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalAtmIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                  className={`${isMobile ? 'mobile-form-field' : 'bg-white'}`}
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

                <div className={`${isMobile ? 'mobile-action-buttons' : 'flex justify-end space-x-2'} pt-4`}>
                  <Button
                    onClick={closeEditModal}
                    variant="outlined"
                    className={isMobile ? 'mobile-button' : ''}
                    sx={isMobile ? {
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
                      }
                    } : {}}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!selectedObjectifId}
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
                    Modifier
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog
            open={deleteOpen}
            onClose={closeDeleteModal}
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogContent>
              <Typography>
                Êtes-vous sûr de vouloir supprimer la dépense « {toDeleteDepense?.libelle} » ? Cette action est irréversible.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteModal}>Annuler</Button>
              <Button onClick={handleConfirmDelete} color="error" variant="contained">
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }

  return null;
}

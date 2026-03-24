import PropTypes from 'prop-types';
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from '@mui/icons-material/BorderColor';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
// project import
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Skeleton, TextField, Tooltip, Fade, alpha, useTheme, useMediaQuery, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { connect } from '../../_services/account.service';
import { Link } from 'react-router-dom';
import { useCategoriesEntreprise, useCreateCategorie, useUpdateCategorie } from '../../usePerso/fonction.categorie';
import { CategorieFormType } from '../../typescript/FormType';
import { CateBouType } from '../../typescript/DataType';
import { useStoreUuid } from '../../usePerso/store';
import { useDeleteCategorie } from '../../usePerso/fonction.categorie';
import { BASE } from '../../_services/caller.service';
import img from '../../../public/icon-192x192.png';
import { useForm } from 'react-hook-form';
import './mobile-shadows.css';

// ===============================|| SHADOW BOX ||=============================== //
interface ShadowBoxProps {
  shadow: CateBouType,
}



function ShadowBox({ shadow }: ShadowBoxProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // let url = BASE(shadow.image);
  const url = shadow.image ? BASE(shadow.image) : img;
  return (
    <Paper
      elevation={isMobile ? 2 : 0}
      className={`relative p-4 rounded-lg transition-all duration-200 hover:shadow-md border-x-2 animate-border-rotate mobile-shadow-card mobile-hover-effect ${isMobile ? 'mobile-glass' : ''}`}
      sx={{
        borderRadius: isMobile ? '20px' : '8px',
        minHeight: { xs: '140px', sm: '160px' }
      }}
    >
      <Link to={`/categorie/sous/${shadow.uuid}`} className="block">
        <div className="flex flex-col items-center space-y-3 p-2">
          <Box
            className="mobile-article-image"
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <img
              src={url}
              alt={shadow.libelle}
              className="w-full h-full object-cover"
            />
          </Box>
          <div className="text-center">
            <Typography
              variant="subtitle1"
              className="font-medium text-gray-900"
              sx={{
                fontSize: { xs: '0.9rem', sm: '1rem' },
                fontWeight: 600
              }}
            >
              {shadow.libelle}
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-500"
              sx={{
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              {shadow.sous_categorie_count}
            </Typography>
          </div>
        </div>
      </Link>

      <div className="absolute top-2 right-2">
        <Tooltip title="Modifier" arrow TransitionComponent={Fade}>
          <Link to={`/categorie/modif/${shadow.uuid}`}>
            <IconButton
              size="small"
              className={`bg-white hover:bg-gray-50 shadow-sm mobile-edit-button ${isMobile ? 'mobile-glass' : ''}`}
              sx={{
                borderRadius: isMobile ? '12px' : '4px'
              }}
            >
              <EditIcon fontSize="small" className="text-blue-600" />
            </IconButton>
          </Link>
        </Tooltip>
      </div>
    </Paper>
  );
}

export default function ComponentShadow() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const uuid = useStoreUuid((state) => state.selectedId);
 
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CategorieFormType>();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CateBouType | null>(null);
  const [toDeleteCategory, setToDeleteCategory] = useState<CateBouType | null>(null);

  const { cateEntreprises, isLoading } = useCategoriesEntreprise();

  const { ajoutCategorie } = useCreateCategorie();
  const { updateCategorie } = useUpdateCategorie();
  const { deleteCategorie } = useDeleteCategorie();

  const functionopen = () => setOpen(true);
  const closeopen = () => {
    reset();
    setSelectedCategory(null);
    setOpen(false);
  };

  const openEditModal = (category: CateBouType) => {
    setSelectedCategory(category);
    setValue('libelle', category.libelle);
    setOpen(false);
    setEditOpen(true);
  };

  const closeEditModal = () => {
    reset();
    setSelectedCategory(null);
    setEditOpen(false);
  };

  const openDeleteModal = (category: CateBouType) => {
    setToDeleteCategory(category);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setToDeleteCategory(null);
    setDeleteOpen(false);
  };

  const handleConfirmDelete = () => {
    if (toDeleteCategory) {
      deleteCategorie(toDeleteCategory as any);
    }
    closeDeleteModal();
  };

  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue('image', e.target.files[0]);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (data: CategorieFormType) => {
    data.user_id = connect;
    data.entreprise_id = uuid!;

    if (selectedCategory) {
      updateCategorie({
        ...selectedCategory,
        libelle: data.libelle,
        image: data.image,
        user_id: connect,
      } as any);
      closeEditModal();
    } else {
      ajoutCategorie(data);
      closeopen();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', padding: { xs: 2, sm: 3 } }} className="mobile-loading">
        <Grid container spacing={isMobile ? 2 : 3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={item}>
              <Skeleton
                variant="rectangular"
                height={isMobile ? 140 : 160}
                className="rounded-lg"
                sx={{ borderRadius: isMobile ? '20px' : '8px' }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (cateEntreprises) {
    const filteredCategories = cateEntreprises.filter((post) =>
      post.libelle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className={`min-h-screen ${isMobile ? '' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isMobile ? 'mobile-header-container' : ''}`}>
            <Typography
              variant="h4"
              className={`font-semibold text-gray-900 ${isMobile ? 'mobile-title' : ''}`}
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem' },
                textAlign: isMobile ? 'center' : 'left'
              }}
            >
              Nature de la dépense
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4">
              <TextField
                placeholder="Rechercher un article..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                className={`bg-white ${isMobile ? 'mobile-search-container' : ''}`}
                InputProps={{
                  startAdornment: <SearchIcon className="mr-2 text-gray-400" />,
                }}
                size="small"
                sx={{
                  borderRadius: isMobile ? '16px' : '4px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: isMobile ? '16px' : '4px',
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={functionopen}
                startIcon={<AddIcon />}
                className={`bg-blue-600 hover:bg-blue-700 whitespace-nowrap ${isMobile ? 'mobile-button' : ''}`}
                sx={{
                  borderRadius: isMobile ? '12px' : '6px',
                  fontWeight: isMobile ? 600 : 400,
                }}
              >
                Nouveau nom
              </Button>
            </div>
          </div>

          <Paper elevation={isMobile ? 0 : 1} className="rounded-xl overflow-hidden shadow-sm">
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="table catégories">
                <TableHead>
                  <TableRow className="bg-gray-100">
                    <TableCell sx={{ fontWeight: 700 }}>Libellé</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((row, index) => (
                    <TableRow
                      key={row.uuid || index}
                      sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.libelle}
                      </TableCell>
                      <TableCell align="right">
                        <div className="flex items-center justify-end space-x-1">
                          <Tooltip title="Modifier la catégorie" arrow>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => openEditModal(row)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer la catégorie" arrow>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => openDeleteModal(row)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Dialog
            open={open || editOpen}
            onClose={open ? closeopen : closeEditModal}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              elevation: 0,
              className: 'rounded-10',
              sx: isMobile
                ? {
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                  }
                : {},
            }}
          >
            <DialogTitle
              className="flex justify-between items-center border-b pb-3 bg-gradient-to-r from-blue-500 to-green-600 text-white"
              sx={{ borderRadius: isMobile ? '20px 20px 0 0' : '8px 8px 0 0' }}
            >
              <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' }, fontWeight: 600 }}>
                {selectedCategory ? 'Modifier la catégorie' : 'Nouvel article'}
              </Typography>
              <IconButton onClick={open ? closeopen : closeEditModal} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent className="mt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <TextField
                  fullWidth
                  label="Nom de l'article"
                  {...register('libelle', { required: 'Ce champ est obligatoire' })}
                  error={!!errors.libelle}
                  helperText={errors.libelle?.message}
                  className={isMobile ? 'mobile-form-field' : ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: isMobile ? '12px' : '4px' } }}
                />

                <TextField
                  fullWidth
                  label="Image"
                  type="file"
                  onChange={handleImageChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ startAdornment: <ImageIcon className="mr-2 text-gray-400" /> }}
                  className={isMobile ? 'mobile-form-field' : ''}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: isMobile ? '12px' : '4px' } }}
                />

                <div className="pt-4 border-t flex justify-end gap-2">
                  <Button onClick={open ? closeopen : closeEditModal} color="inherit">
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'mobile-button' : ''}`}
                    sx={{ borderRadius: isMobile ? '12px' : '4px', fontWeight: isMobile ? 600 : 400 }}
                  >
                    {selectedCategory ? 'Mettre à jour' : 'Enregistrer'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteOpen} onClose={closeDeleteModal} fullWidth maxWidth="xs">
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogContent>
              <Typography>
                Êtes-vous sûr de vouloir supprimer « {toDeleteCategory?.libelle} » ? Cette action est irréversible.
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
}

ShadowBox.propTypes = { shadow: PropTypes.object.isRequired };

// CustomShadowBox.propTypes = { shadow: PropTypes.string, label: PropTypes.string, color: PropTypes.string, bgcolor: PropTypes.string };

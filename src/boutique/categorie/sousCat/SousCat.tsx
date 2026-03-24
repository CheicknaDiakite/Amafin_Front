import PropTypes from 'prop-types';
// material-ui
import Grid from '@mui/material/Grid';
import CloseIcon from "@mui/icons-material/Close"

import Typography from '@mui/material/Typography';

// project import

import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, TextField, Paper, Tooltip, Fade, alpha, useTheme, useMediaQuery } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { RecupType, RouteParams } from '../../../typescript/DataType';
import { connect } from '../../../_services/account.service';
import { Link, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/BorderColor';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import img from '../../../../public/icon-192x192.png'
import { useAllGetSousCate, useCreateSousCate, useFetchCategorie } from '../../../usePerso/fonction.categorie';
import MyTextField from '../../../_components/Input/MyTextField';
import Nav from '../../../_components/Button/Nav';
import { SousCategorieFormType } from '../../../typescript/FormType';
import { useStoreUuid } from '../../../usePerso/store';
import { useFetchEntreprise, useFetchUser } from '../../../usePerso/fonction.user';
import { isLicenceExpired } from '../../../usePerso/fonctionPerso';
import { BASE } from '../../../_services/caller.service';
import M_Abonnement from '../../../_components/Card/M_Abonnement';
import { useForm } from 'react-hook-form';
import './mobile-souscat.css';

// ==============================|| DASHBOARD - DEFAULT ||============================== //
export interface SousCategorie {
  libelle: string;
  all_inventaire: number;
  slug: string;
}

export interface CardSousCateProps {
  post: RecupType;
}

interface ShadowBoxProps {
  shadow: RecupType,
}

function ShadowBox({ shadow }: ShadowBoxProps) {
  const url = shadow.image ? BASE(shadow.image) : img;
  const { unUser } = useFetchUser(connect);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper 
      elevation={isMobile ? 2 : 0} 
      className={`relative p-4 rounded-lg transition-all duration-200 hover:shadow-md border-x-2 animate-border-rotate mobile-product-card mobile-hover-effect ${isMobile ? 'mobile-glass' : ''}`}
      sx={{
        borderRadius: isMobile ? '20px' : '8px',
        minHeight: { xs: '140px', sm: '160px' }
      }}
    >
      {(unUser.role === 1 || unUser.role === 2) ? (
        <Link to={`/categorie/info/${shadow.uuid}`} className="block">
          <div className="flex flex-col items-center space-y-3 p-2">
            <div className={`w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center mobile-product-image`}>
              <img 
                src={url} 
                alt={shadow.libelle} 
                className="w-16 h-16 object-contain"
                style={{
                  width: isMobile ? '48px' : '64px',
                  height: isMobile ? '48px' : '64px'
                }}
              />
            </div>
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
          </div>
        </Link>
      ) : (
        <div className="flex flex-col items-center space-y-3 p-2">
          <Box
            className="mobile-product-image"
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
        </div>
      )}
      
      <div className="absolute top-2 right-2">
        <Tooltip title="Modifier" arrow TransitionComponent={Fade}>
          <Link to={`/categorie/sous/modif/${shadow.uuid}`}>
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

export default function SousCat() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { uuid } = useParams<RouteParams>();
  const entreprise_uuid = useStoreUuid((state) => state.selectedId);
  const { unEntreprise } = useFetchEntreprise(entreprise_uuid);
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<SousCategorieFormType>();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { unCategorie } = useFetchCategorie(uuid!)
  
  const { getSousCates, isLoading, isError } = useAllGetSousCate(uuid!);
  const { ajoutSousCate } = useCreateSousCate();

  const functionopen = () => setOpen(true);
  const closeopen = () => {
    reset();
    setOpen(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue("image", e.target.files[0]);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (data: SousCategorieFormType) => {
    data.user_id = connect;
    data.categorie_slug = uuid || '';
    ajoutSousCate(data);
    closeopen();
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

  if (isError) {
    return (
      <Alert 
        severity="error" 
        className={`m-4 ${isMobile ? 'mobile-alert' : ''}`}
        sx={{ borderRadius: isMobile ? '16px' : '4px' }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => window.location.reload()}
            className={isMobile ? 'mobile-button' : ''}
          >
            Réessayer
          </Button>
        }
      >
        Problème de connexion ! Veuillez réessayer.
      </Alert>
    );
  }

  if (getSousCates) {
    const filteredCategories = getSousCates.filter((post) =>
      post.libelle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className={`min-h-screen ${isMobile ? '' : ''}`}>
        <Nav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
            <div className={`mb-6 ${isMobile ? 'mobile-header-container' : ''}`}>
              <Typography 
                variant="h4" 
                className={`font-semibold text-gray-900 ${isMobile ? 'mobile-title' : ''}`}
                sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2rem' },
                  textAlign: isMobile ? 'center' : 'left'
                }}
              >
                {unCategorie?.libelle}
              </Typography>
            </div>
          

          <div className={`mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isMobile ? 'mobile-header-container' : ''}`}>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <TextField
                placeholder="Rechercher un produit..."
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
                  }
                }}
              />
              
              <Button
                variant="contained"
                onClick={functionopen}
                startIcon={<AddIcon />}
                className={`bg-blue-600 hover:bg-blue-700 whitespace-nowrap ${isMobile ? 'mobile-button' : ''}`}
                sx={{
                  borderRadius: isMobile ? '12px' : '4px',
                  fontWeight: isMobile ? 600 : 400
                }}
              >
                Nouveau Produit
              </Button>
            </div>
          </div>

          <Grid 
            container 
            spacing={isMobile ? 2 : 3} 
            className={'mt-3'}
            sx={{
              '& .MuiGrid-item': {
                padding: { xs: '6px', sm: '12px' }
              }
            }}
          >
            {filteredCategories && filteredCategories.length > 0 ? (
              filteredCategories.map((post, index) => (
                <Grid 
                  key={index} 
                  item 
                  xs={6} 
                  sm={4} 
                  md={3} 
                  lg={2}
                  className={`mobile-stagger-${(index % 6) + 1}`}
                  sx={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <ShadowBox shadow={post} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  className={`p-8 text-center border rounded-lg ${isMobile ? 'mobile-empty-card' : ''}`}
                  sx={{ 
                    borderRadius: isMobile ? '16px' : '8px',
                    padding: { xs: '24px', sm: '32px' }
                  }}
                >
                  <Typography 
                    variant="body1" 
                    className="text-gray-500"
                    sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    Aucun produit trouvé
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>

          <Dialog 
            open={open} 
            onClose={closeopen} 
            fullWidth 
            maxWidth="sm"
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
            <DialogTitle 
              className={`flex justify-between items-center border-b pb-3 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white`}
              sx={{
                borderRadius: isMobile ? '20px 20px 0 0' : '8px 8px 0 0'
              }}
            >
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  fontWeight: 600
                }}
              >
                Nouveau Produit
              </Typography>
              <IconButton 
                onClick={closeopen} 
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            {isLicenceExpired(unEntreprise.licence_date_expiration) ? (
              <M_Abonnement />
            ) : (
              <DialogContent className="mt-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <MyTextField
                    fullWidth
                    label="Nom du produit"
                    {...register("libelle", { required: "Ce champ est obligatoire" })}
                    error={!!errors.libelle}
                    helperText={errors.libelle?.message}
                    className={isMobile ? 'mobile-form-field' : ''}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: isMobile ? '12px' : '4px',
                      }
                    }}
                  />

                  <MyTextField
                    fullWidth
                    label="Image"
                    type="file"
                    onChange={handleImageChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <ImageIcon className="mr-2 text-gray-400" />,
                    }}
                    className={isMobile ? 'mobile-form-field' : ''}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: isMobile ? '12px' : '4px',
                      }
                    }}
                  />

                  <div className="pt-4 border-t flex justify-end">
                    <Button
                      type="submit"
                      variant="contained"
                      className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'mobile-button' : ''}`}
                      sx={{
                        borderRadius: isMobile ? '12px' : '4px',
                        fontWeight: isMobile ? 600 : 400
                      }}
                    >
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>
    );
  }
}

ShadowBox.propTypes = { shadow: PropTypes.string };

// import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Typography,
  Button,
  // Tabs,
  // Tab,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Box,
  Skeleton,
  Paper,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { ChangeEvent, Fragment, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { FormValueType } from "../../../typescript/FormType";
// import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCreateAdminUser, useFetchAllUsers, useFetchEntreprise } from "../../../usePerso/fonction.user";
import Nav from "../../../_components/Button/Nav";
import MyTextField from "../../../_components/Input/MyTextField";
import { useStoreUuid } from "../../../usePerso/store";
// import { format } from "date-fns";
import M_Abonnement from "../../../_components/Card/M_Abonnement";
import { isLicenceExpired, stringAvatar } from "../../../usePerso/fonctionPerso";
import MainCard from "../../../components/MainCard";
import { useForm } from "react-hook-form";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Chart_3 from "../../../_components/Chart/Chart_3";
import '../mobile-personnel-client.css';

export default function Personnel() {
  const uuid = useStoreUuid((state) => state.selectedId)
  const {unEntreprise} = useFetchEntreprise(uuid)
  const [isMobile, setIsMobile] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValueType>();
  
  const [open, setOpen] = useState(false);
    
  const functionopen = () => setOpen(true);
  const closeopen = () => {
    reset(); // Réinitialise le formulaire à la fermeture
    setOpen(false);
  };

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const top = {
    entreprise_id: uuid,
    // user_id: connect,
    user_id: localStorage.getItem('token'),
  };
  
  const { getUser, isLoading, isError } = useFetchAllUsers(top);
  // const {getUsers} = useAllUsers()
  // const {unEntreprise} = useFetchEntreprise(uuid!)
  // const { userEntreprises } = useGetUserEntreprises(connect);
  const { createAdmin } = useCreateAdminUser();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 4 : 6;

  const totalPages = Math.ceil(getUser.length / itemsPerPage);

  const getUs = getUser.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const onSubmit = (data: FormValueType) => {
    // data.user_id = connect;
    data.entreprise_id = uuid!;


    createAdmin(data);
    
    closeopen();
  };

  if (isLoading) {
    return (
      <Box className={`${isMobile ? 'mobile-p-4' : 'p-4'}`}>
        <Skeleton variant="rectangular" height={200} className={`${isMobile ? 'mobile-loading' : ''} mb-4`} />
        <Skeleton variant="rectangular" height={100} className={`${isMobile ? 'mobile-loading' : ''} mb-2`} />
        <Skeleton variant="rectangular" height={100} className={isMobile ? 'mobile-loading' : ''} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className={`${isMobile ? 'mobile-p-4' : 'p-4'}`}>
        <Typography variant="h6" color="error" className={isMobile ? 'mobile-alert' : ''}>
          Une erreur est survenue lors du chargement des données
        </Typography>
      </Box>
    );
  }

  if (getUser) {
    return (
      <div className={`min-h-screen ${isMobile ? '' : ''} py-6`}>
        <div className={`${isMobile ? 'px-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <Nav />
          
          <div className={isMobile ? 'mobile-chart-section' : ''}>
            <Chart_3 />
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
                    Gestion du Personnel
                  </Typography>
                  <Typography variant="body2" className={`${isMobile ? 'text-gray-600 mt-2' : 'text-gray-500 mt-1'}`}>
                    Gérez les membres de votre entreprise
                  </Typography>
                </div>
                <Button
                  onClick={functionopen}
                  variant="contained"
                  startIcon={<PersonAddIcon />}
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
                  Ajouter un membre
                </Button>
              </div>

              {/* Grid of Personnel Cards */}
              <Grid 
                container 
                spacing={isMobile ? 2 : 3}
                className={isMobile ? 'mobile-grid' : ''}
                sx={{
                  '& .MuiGrid-item': {
                    padding: isMobile ? '8px' : '12px'
                  }
                }}
              >
                {getUs.map((post: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={post.id} className={`${isMobile ? `mobile-stagger-${(index % 6) + 1}` : ''}`}>
                    <Link to={`/entreprise/personnel/modif/${post.uuid}`} className={isMobile ? 'mobile-card-link' : ''}>
                      <MainCard 
                        className={`${isMobile ? 'mobile-personnel-card' : 'transition-all duration-200 hover:shadow-md'}`}
                        sx={{ 
                          height: '100%',
                          ...(isMobile ? {
                            borderRadius: '16px',
                            backdropFilter: 'blur(10px)',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            animation: 'scaleIn 0.6s ease-out',
                            overflow: 'hidden',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.15)',
                              animation: 'cardHover 0.3s ease-out forwards'
                            }
                          } : {})
                        }}
                        content={false}
                      >
                        <ListItem alignItems="flex-start" className={`${isMobile ? 'mobile-list-item' : 'h-full'}`}>
                          <ListItemAvatar>
                            <Avatar 
                              {...stringAvatar(`${post.last_name} ${post.first_name}`)} 
                              className={isMobile ? 'mobile-avatar' : ''}
                              sx={isMobile ? {
                                transition: 'all 0.3s ease',
                                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                              } : {}}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography 
                                variant="subtitle1" 
                                className={`${isMobile ? 'mobile-card-text font-medium' : 'font-medium'}`}
                              >
                                {post.username}
                              </Typography>
                            }
                            secondary={
                              <Fragment>
                                <div className="space-y-1 mt-1">
                                  <Typography variant="body2" color="text.secondary" className={isMobile ? 'mobile-card-text' : ''}>
                                    Nom complet : {post.last_name} {post.first_name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" className={isMobile ? 'mobile-card-text' : ''}>
                                    Tél : {post.numero}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" className={isMobile ? 'mobile-card-text' : ''}>
                                    Email : {post.email_user}
                                  </Typography>
                                  <div className="mt-2">
                                    <Chip
                                      label={
                                        post.role === 1 ? "Admin" :
                                        post.role === 2 ? "Superviseur" :
                                        post.role === 3 ? "Caissier(e)" : "Pas de rôle"
                                      }
                                      variant="outlined"
                                      color={post.role === 1 ? "primary" : post.role === 2 ? "primary" : "info"}
                                      size="small"
                                      className={isMobile ? 'mobile-role-chip' : ''}
                                      sx={isMobile ? {
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        transition: 'all 0.3s ease',
                                        backdropFilter: 'blur(10px)',
                                        '&:hover': {
                                          transform: 'scale(1.05)',
                                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                        }
                                      } : {}}
                                    />
                                  </div>
                                </div>
                              </Fragment>
                            }
                          />
                        </ListItem>
                      </MainCard>
                    </Link>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <Box className={`${isMobile ? 'mobile-pagination' : 'flex justify-center mt-6'}`}>
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
              </Box>
            </Box>
          </Paper>

          {/* Add Member Dialog */}
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
              <Typography variant="h6" className="font-semibold">
                Ajouter un nouveau membre
              </Typography>
              <IconButton onClick={closeopen} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            {isLicenceExpired(unEntreprise.licence_date_expiration) ? (
              <M_Abonnement />
            ) : (
              <DialogContent className={`${isMobile ? 'mobile-p-4' : 'mt-4'}`}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <MyTextField
                    label="Prénom"
                    {...register("last_name", { required: "Ce champ est obligatoire" })}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    fullWidth
                    className={isMobile ? 'mobile-form-field' : ''}
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
                    label="Nom"
                    {...register("first_name", { required: "Ce champ est obligatoire" })}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    fullWidth
                    className={isMobile ? 'mobile-form-field' : ''}
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
                    label="Téléphone"
                    {...register("numero", { required: "Ce champ est obligatoire" })}
                    error={!!errors.numero}
                    helperText={errors.numero?.message}
                    inputProps={{
                      pattern: "^[+]?\\d*$",
                      maxLength: 15,
                    }}
                    fullWidth
                    className={isMobile ? 'mobile-form-field' : ''}
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
                    label="Email"
                    type="email"
                    {...register("email_user", { required: "Ce champ est obligatoire" })}
                    error={!!errors.email_user}
                    helperText={errors.email_user?.message}
                    fullWidth
                    className={isMobile ? 'mobile-form-field' : ''}
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
                    label="Mot de passe"
                    type="password"
                    {...register("password", { required: "Ce champ est obligatoire" })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    className={isMobile ? 'mobile-form-field' : ''}
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

                  <div className={`${isMobile ? 'mobile-action-buttons' : 'pt-4 flex justify-end space-x-3'}`}>
                    <Button 
                      onClick={closeopen} 
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
        </div>
      </div>
    );
  }

  return null;
}

import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { 
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
  alpha,
  Tooltip,
  Fade
} from '@mui/material';
import { connect } from '../../../../../_services/account.service';
import { useDeleteEntreprise, useFetchEntreprise, useUpdateEntreprise } from '../../../../../usePerso/fonction.user';
import countryList from 'react-select-country-list';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import KeyIcon from '@mui/icons-material/Key';
import { useStoreUuid } from '../../../../../usePerso/store';
import { BASE } from '../../../../../_services/caller.service';
import img from '../../../../../../public/icon-192x192.png';
import '../../mobile-admin.css';

export default function ModifEntreprise() {
  const uuid = useStoreUuid((state) => state.selectedId);
  const { unEntreprise, setUnEntreprise, isLoading, isError } = useFetchEntreprise(uuid);
  const { deleteEntreprise } = useDeleteEntreprise();
  const { updateEntreprise } = useUpdateEntreprise();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const options = countryList().getData();
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteEntreprise({ ...unEntreprise, user_id: connect });
    setShowConfirm(false);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnEntreprise({ ...unEntreprise, [name]: value });
  };

  const onSelectChange = (e: SelectChangeEvent<string>) => {
    setUnEntreprise({ ...unEntreprise, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!unEntreprise) return null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEntreprise({ ...unEntreprise, user_id: connect, image });
  };

  const onSubmitAbon = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateEntreprise({ ...unEntreprise, user_id: connect });
    setOpen(false);
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center p-8">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert 
        severity="error" 
        className="m-4"
        action={
          <Button color="inherit" size="small" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        }
      >
        Problème de connexion ! Veuillez réessayer.
      </Alert>
    );
  }

  const url = unEntreprise.image ? BASE(unEntreprise.image) : img;
  
  return (
    <div className={`max-w-4xl mx-auto p-4 ${isMobile ? 'mobile-modif-container' : ''}`}>
      <div className={`mb-6 flex items-center justify-between ${isMobile ? 'mobile-modif-header' : ''}`}>
        <Typography variant="h4" className={`font-semibold text-gray-900 ${isMobile ? 'mobile-modif-title' : ''}`}>
          Paramètres de l'entreprise
        </Typography>

        <Tooltip title="Supprimer l'entreprise" arrow TransitionComponent={Fade}>
          <IconButton 
            onClick={handleDelete}
            className={`bg-white hover:bg-red-50 text-red-600 shadow-sm ${isMobile ? 'mobile-action-button' : ''}`}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>

      {showConfirm && (
        <Alert 
          severity="warning" 
          className="mt-4"
          action={
            <div className="space-x-2">
              <Button color="inherit" size="small" onClick={() => setShowConfirm(false)}>
                Annuler
              </Button>
              <Button color="error" size="small" onClick={confirmDelete}>
                Confirmer
              </Button>
            </div>
          }
        >
          Êtes-vous sûr de vouloir supprimer cette entreprise ?
        </Alert>
      )}

      <Paper elevation={0} className={`border rounded-lg overflow-hidden ${isMobile ? 'mobile-modif-paper' : ''}`}>
        <form onSubmit={onSubmit}>
          <div className={`p-6 space-y-6 ${isMobile ? 'mobile-modif-form' : ''}`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isMobile ? 'mobile-responsive-grid' : ''}`}>
              <div className={isMobile ? 'mobile-modif-section' : ''}>
                <Typography variant="subtitle2" className={`mb-4 text-gray-600 ${isMobile ? 'mobile-modif-section-title' : ''}`}>
                  Informations générales
                </Typography>

                <Stack spacing={3} className={isMobile ? 'mobile-responsive-stack' : ''}>
                  <Typography 
                    variant="h6" 
                    color="primary" 
                    gutterBottom
                    className={isMobile ? 'mobile-text-center mobile-text-lg mobile-font-medium' : ''}
                    sx={{
                      mb: 3,
                      fontWeight: 'medium',
                      textAlign: 'center',
                      backgroundColor: alpha('#1976d2', 0.1),
                      p: 2,
                      borderRadius: 1
                    }}
                  >
                    Identifiant de l'entreprise : {unEntreprise.ref}
                  </Typography>

                  <div className={isMobile ? '' : ''}>
                    <TextField
                      fullWidth
                      label="Nom de l'entreprise"
                      name="nom"
                      value={unEntreprise.nom}
                      onChange={onChange}
                      required
                    />
                  </div>

                  <div className={isMobile ? '' : ''}>
                    <TextField
                      fullWidth
                      label="Type d'entreprise"
                      name="libelle"
                      value={unEntreprise.libelle}
                      onChange={onChange}
                      required
                    />
                  </div>

                  <div className={isMobile ? '' : ''}>
                    <FormControl fullWidth>
                      <InputLabel>Pays</InputLabel>
                      <Select
                        value={unEntreprise.pays}
                        onChange={onSelectChange}
                        name="pays"
                        label="Pays"
                      >
                        {options.map((option) => (
                          <MenuItem key={option.value} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </Stack>
              </div>

              <div className={isMobile ? 'mobile-modif-section' : ''}>
                <Typography variant="subtitle2" className={`mb-4 text-gray-600 ${isMobile ? 'mobile-modif-section-title' : ''}`}>
                  Contact et Image
                </Typography>

                <Stack spacing={3} className={isMobile ? 'mobile-responsive-stack' : ''}>
                  <div className="space-y-4">
                    <Box className={`w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 ${isMobile ? 'mobile-modif-image-container' : ''}`}>
                      {(previewUrl || url) && (
                        <img 
                          src={previewUrl || url} 
                          alt={unEntreprise.nom} 
                          className={`max-h-full object-contain ${isMobile ? 'mobile-modif-image' : ''}`}
                        />
                      )}
                    </Box>
                    <div className={isMobile ? '' : ''}>
                      <TextField
                        fullWidth
                        type="file"
                        onChange={handleImageChange}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: <ImageIcon className="mr-2 text-gray-400" />,
                        }}
                      />
                    </div>
                  </div>

                  <div className={isMobile ? '' : ''}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={unEntreprise.email}
                      onChange={onChange}
                    />
                  </div>

                  <div className={isMobile ? '' : ''}>
                    <TextField
                      fullWidth
                      label="Numéro de téléphone"
                      name="numero"
                      value={unEntreprise.numero}
                      onChange={onChange}
                    />
                  </div>

                  <div className={isMobile ? '' : ''}>
                    <TextField
                      fullWidth
                      label="Adresse"
                      name="adresse"
                      value={unEntreprise.adresse}
                      onChange={onChange}
                      multiline
                      rows={2}
                    />
                  </div>

                  <div className={isMobile ? '' : ''}>
                    <TextField
                      fullWidth
                      label="Coordonne"
                      name="coordonne"
                      value={unEntreprise.coordonne}
                      onChange={onChange}
                      multiline
                      rows={2}
                    />
                  </div>
                </Stack>
              </div>
            </div>
          </div>

          <div className={`px-6 py-4 bg-gray-50 border-t flex justify-between items-center ${isMobile ? 'mobile-modif-actions' : ''}`}>
            <Button
              variant="outlined"
              startIcon={<KeyIcon />}
              onClick={() => setOpen(true)}
              className={isMobile ? 'mobile-modif-button secondary' : ''}
            >
              Code d'abonnement
            </Button>

            <Button
              type="submit"
              variant="contained"
              className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'mobile-modif-button primary' : ''}`}
            >
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          elevation: 0,
          className: `rounded-lg ${isMobile ? 'mobile-modif-dialog' : ''}`
        }}
      >
        <DialogTitle className={`flex justify-between items-center border-b pb-3 ${isMobile ? 'mobile-modif-dialog-title' : ''}`}>
          <Typography variant="h6">Code d'abonnement</Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent className={`mt-4 ${isMobile ? 'mobile-modif-dialog-content' : ''}`}>
          <form onSubmit={onSubmitAbon} className="space-y-4">
            <TextField
              fullWidth
              label="Code d'abonnement"
              name="code"
              onChange={onChange}
              required
              autoFocus
            />

            <div className={`pt-4 border-t flex justify-end ${isMobile ? 'mobile-modif-dialog-actions' : ''}`}>
              <Button
                type="submit"
                variant="contained"
                className={`bg-blue-600 hover:bg-blue-700 ${isMobile ? 'mobile-modif-button primary' : ''}`}
              >
                Valider
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

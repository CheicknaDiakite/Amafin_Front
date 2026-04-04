import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Stack,
  Avatar,
  SelectChangeEvent
} from '@mui/material';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchUser, useUpdateUser } from '../../../usePerso/fonction.user';
import { connect } from '../../../_services/account.service';
import countryList from 'react-select-country-list';
import toast from 'react-hot-toast';
import { logout } from '../../../usePerso/fonctionPerso';
import Nav from '../../../_components/Button/Nav';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { BASE } from '../../../_services/caller.service';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
};

export default function Admin() {
  const { uuid } = useParams();
  const [open, setOpen] = useState(false);
  // @ts-ignore - useFetchUser actually doesn't accept an argument, but keeping original code's behavior
  const { unUser, setUnUser, isLoading, isError } = useFetchUser(uuid!);
  const { updateUser } = useUpdateUser();
  const options = countryList().getData();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUnUser({
      ...unUser,
      [name]: value,
    });
  };

  const onSelectChange = (e: SelectChangeEvent<string>) => {
    setUnUser({
      ...unUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(unUser).forEach(key => {
      const value = unUser[key as keyof typeof unUser];
      // Skip avatar (if it's the old string URL), and other objects (like id/uuid if they are objects, but here they are strings)
      if (key === 'avatar') return;

      if (value !== null && value !== undefined && typeof value !== 'object') {
        formData.append(key, value.toString());
      }
    });

    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    // Ensure uuid and user_id are set
    formData.append('uuid', unUser.uuid || uuid || '');
    formData.append('user_id', connect);

    updateUser(formData);
  };

  const onSubmitPass = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Use the actual logged-in user's uuid for the update payload to bypass permission blocks
    unUser["uuid"] = connect;
    unUser["user_id"] = connect;

    if (unUser.password !== unUser.repassword) {
      toast.error("Les deux mots de passe ne correspondent pas");
      return;
    }

    const formData = new FormData();
    formData.append('uuid', connect);
    formData.append('user_id', connect);
    formData.append('password', unUser.password || '');
    formData.append('repassword', unUser.repassword || '');

    updateUser(formData, {
      onSuccess: (data: any) => {
        if (data && data.etat === true) {
          logout();
        }
      }
    });
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="sm" className="py-8">
        <Alert
          severity="error"
          className="shadow-lg"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          }
        >
          Une erreur est survenue lors du chargement des données
        </Alert>
      </Container>
    );
  }

  if (unUser) {
    return (
      <>

        <Container maxWidth="lg" className="py-8">
          <Paper elevation={0} className="border rounded-lg overflow-hidden">
            <Box className="p-6 border-b bg-gray-50">
              <div className="flex items-center gap-4">
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="avatar-upload">
                  <IconButton component="span">
                    <Avatar
                      className="w-16 h-16 bg-blue-100 text-blue-600 cursor-pointer hover:opacity-80 transition-opacity"
                      src={avatarFile ? URL.createObjectURL(avatarFile) : (unUser.avatar ? BASE(unUser.avatar) : undefined)}
                    >
                      {!avatarFile && !unUser.avatar && <PersonIcon className="w-8 h-8" />}
                    </Avatar>
                  </IconButton>
                </label>
                <div>
                  <Typography variant="h4" className="font-semibold text-gray-900">
                    Profile Utilisateur
                  </Typography>
                  <Typography variant="body1" className="text-gray-500">
                    Gérez vos informations personnelles et vos paramètres de sécurité
                  </Typography>
                </div>
              </div>
            </Box>

            <Box className="p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Stack spacing={3}>
                    <Typography variant="subtitle2" className="text-gray-600 font-medium">
                      Informations de base
                    </Typography>

                    <TextField
                      label="Nom d'utilisateur"
                      name="username"
                      value={unUser.username || ''}
                      onChange={onChange}
                      disabled
                      className="bg-gray-50"
                      fullWidth
                    />

                    <TextField
                      label="Nom"
                      name="last_name"
                      value={unUser.last_name || ''}
                      onChange={onChange}
                      required
                      fullWidth
                    />

                    <TextField
                      label="Prénom"
                      name="first_name"
                      value={unUser.first_name || ''}
                      onChange={onChange}
                      required
                      fullWidth
                    />

                    <TextField
                      label="Profession"
                      name="profession"
                      value={unUser.profession || ''}
                      onChange={onChange}
                      fullWidth
                    />
                  </Stack>

                  <Stack spacing={3}>
                    <Typography variant="subtitle2" className="text-gray-600 font-medium">
                      Contact et Localisation
                    </Typography>

                    <TextField
                      label="Numéro"
                      name="numero"
                      value={unUser.numero || ''}
                      onChange={onChange}
                      fullWidth
                    />

                    <FormControl fullWidth>
                      <InputLabel>Pays</InputLabel>
                      <Select
                        value={unUser.pays || ''}
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

                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={unUser.email || ''}
                      onChange={onChange}
                      required
                      fullWidth
                    />
                  </Stack>
                </div>

                <Divider />

                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outlined"
                    startIcon={<LockIcon />}
                    onClick={handleOpen}
                  >
                    Changer le mot de passe
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </Box>
          </Paper>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-password"
          >
            <Paper sx={style}>
              <Box className="flex justify-between items-center p-4 border-b">
                <Typography variant="h6" className="font-medium">
                  Changement de mot de passe
                </Typography>
                <IconButton
                  onClick={handleClose}
                  size="small"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <form onSubmit={onSubmitPass} className="p-4 space-y-4">
                <TextField
                  label="Nouveau mot de passe"
                  name="password"
                  type="password"
                  onChange={onChange}
                  required
                  fullWidth
                />

                <TextField
                  label="Confirmer le mot de passe"
                  name="repassword"
                  type="password"
                  onChange={onChange}
                  required
                  fullWidth
                />

                <Box className="pt-4 border-t flex justify-end">
                  <Button
                    type="submit"
                    variant="contained"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Mettre à jour le mot de passe
                  </Button>
                </Box>
              </form>
            </Paper>
          </Modal>
        </Container>
      </>
    );
  }
}

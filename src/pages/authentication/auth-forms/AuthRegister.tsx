import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  CircularProgress,
  Box,
  Avatar,
  Typography,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useCreateUser } from '../../../usePerso/fonction.user';
import countryList from 'react-select-country-list';
import toast from 'react-hot-toast';
import Bienvenue from '../../../_components/Card/Bienvenue';

interface RegisterFormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  numero: string;
  password: string;
  passwordConfirm: string;
  pays: string;
}

const AuthRegister: FC = () => {
  const { create } = useCreateUser();
  const countryOptions = countryList().getData();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      numero: '',
      password: '',
      passwordConfirm: '',
      pays: ''
    }
  });

  const password = watch('password');

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await create(data);
      await delay(4000);

      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erreur lors de l\'inscription'
      );
    }
  };
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Card
        elevation={6}
        sx={{ width: '100%', maxWidth: 640, borderRadius: 3, overflow: 'hidden' }}
      >

        <CardContent sx={{ py: 4, px: 6 }} >

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>

            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <PersonAddAltIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Créer un compte</Typography>
            <Typography variant="body2" color="text.secondary">Remplissez le formulaire pour créer votre compte</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            {isSubmitting && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={36} color="primary" />
              </Box>
            )}

            <Stack spacing={2}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Nom"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message || ''}
                  {...register('last_name', {
                    required: 'Le nom est requis',
                    minLength: { value: 2, message: 'Le nom doit contenir au moins 2 caractères' }
                  })}
                  fullWidth
                  disabled={isSubmitting}
                />

                <TextField
                  label="Prénom"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message || ''}
                  {...register('first_name', {
                    required: 'Le prénom est requis',
                    minLength: { value: 2, message: 'Le prénom doit contenir au moins 2 caractères' }
                  })}
                  fullWidth
                  disabled={isSubmitting}
                />
              </Box>

              <TextField
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message || ''}
                {...register('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                })}
                fullWidth
                disabled={isSubmitting}
              />

              <TextField
                label="Nom d'utilisateur"
                error={!!errors.username}
                helperText={errors.username?.message || ''}
                {...register('username', {
                  required: 'Le nom d\'utilisateur est requis',
                  minLength: { value: 3, message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' }
                })}
                fullWidth
                disabled={isSubmitting}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Numéro de téléphone"
                  error={!!errors.numero}
                  helperText={errors.numero?.message || ''}
                  {...register('numero', {
                    required: 'Le numéro est requis',
                    pattern: {
                      value: /^[+]?[0-9]{8,15}$/,
                      message: 'Format de numéro invalide'
                    }
                  })}
                  fullWidth
                  disabled={isSubmitting}
                />

                {/* <FormControl fullWidth error={!!errors.pays}>
                  <InputLabel>Pays</InputLabel>
                  <Select
                    {...register('pays', { required: 'Le pays est requis' })}
                    label="Pays"
                    disabled={isSubmitting}
                  >
                    {countryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.label}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.pays && (
                    <FormHelperText error>{errors.pays.message}</FormHelperText>
                  )}
                </FormControl> */}
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message || ''}
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                    minLength: { value: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                  })}
                  fullWidth
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(prev => !prev)} size="small">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  label="Confirmer le mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.passwordConfirm}
                  helperText={errors.passwordConfirm?.message || ''}
                  {...register('passwordConfirm', {
                    required: 'La confirmation du mot de passe est requise',
                    validate: value => value === password || 'Les mots de passe ne correspondent pas'
                  })}
                  fullWidth
                  disabled={isSubmitting}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* <Typography
                    component={Link}
                    to="/auth/login"
                    variant="h5"
                    sx={{ 
                      textDecoration: 'none',
                      transition: 'color 0.3s',
                      '&:hover': {
                        color: 'primary.dark'
                      }
                    }}
                    color="primary"
                  >
                    Connexion ?
                  </Typography> */}
                <Button variant="text" component={Link} to="/auth/login" sx={{ textTransform: 'none' }}>
                  Déjà un compte ? Se connecter
                </Button>
              </Box>

              {/* <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}> */}
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ py: 1.5, textTransform: 'none', fontWeight: 600 }}>
                {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
              </Button>

              {/* <Button variant="text" component={Link} to="/auth/login" sx={{ textTransform: 'none' }}>
                  Déjà un compte ? Se connecter
                </Button> */}
              {/* </Box> */}
            </Stack>
          </form>
        </CardContent>
        {/* <Divider />
        <Box sx={{ px: 4, py: 2, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">En vous inscrivant, vous acceptez nos conditions.</Typography>
        </Box> */}
      </Card>
    </Box>
  );
};

export default AuthRegister;

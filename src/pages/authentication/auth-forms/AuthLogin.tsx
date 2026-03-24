import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Stack,
  Card,
  TextField,
  CircularProgress,
  Box,
  CardContent,
  Avatar,
  Typography,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useLoginUser } from '../../../usePerso/fonction.user';
import { TypeAnimation } from 'react-type-animation';

interface LoginFormData {
  username: string;
  password: string;
}

const CONTACT_MESSAGES = [
  "En cas de besoin, contacter : +223 91 15 48 34",
  "En cas de besoin, contacter : Pour plus d'information",
] as const;

const ContactAnimation: FC = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center',
      mx: 5,
      typography: {
        fontSize: { xs: '1.25rem', sm: '1.5rem' },
        fontWeight: 800
      }
    }}
  >
    <Typography
      component="span"
      // className='rounded border-x-2 animate-border-rotate'
      // variant="h5"
      sx={{
        backgroundImage: 'linear-gradient(to right, #60A5FA, #86EFAC)',
        backgroundClip: 'text',
        // color: 'transparent',
        // borderRadius: 1,
        // border: 2,
        // borderColor: 'primary.main',
        px: 2,
        py: 1,
        // animation: 'border-rotate 3s linear infinite',
        // '@keyframes border-rotate': {
        //   '0%': {
        //     borderColor: '#60A5FA'
        //   },
        //   '50%': {
        //     borderColor: '#86EFAC'
        //   },
        //   '100%': {
        //     borderColor: '#60A5FA'
        //   }
        // }
      }}
    >
      <TypeAnimation
        sequence={CONTACT_MESSAGES.map(msg => [msg, 1000]).flat()}
        wrapper="span"
        speed={50}
        style={{ display: 'inline-block' }}
        repeat={Infinity}
      />
    </Typography>
  </Box>
);

const AuthLogin: FC = () => {
  const { login } = useLoginUser();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: ''
    }
  });
  
  useEffect(() => {
    const checkRegistrationSuccess = () => {
      const isSuccess = localStorage.getItem('inscriptionSuccess') === 'true';
      if (isSuccess) {
        toast.success('Inscription réussie');
        toast.success('Un mail vous a été envoyé');
        localStorage.removeItem('inscriptionSuccess');
      }
    };

    checkRegistrationSuccess();
  }, []);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      await delay(4000);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la connexion');
    }
  };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <Card
        elevation={6}
        sx={{ width: '100%', maxWidth: 480, borderRadius: 3, overflow: 'hidden' }}
      >
        <CardContent sx={{ py: 4, px: 5 }} >
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {/* <Bienvenue /> */}
                        
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Connexion</Typography>
            
          </Box>

          <Divider sx={{ my: 3 }} />

          <form onSubmit={handleSubmit(onSubmit)}>
            {isSubmitting && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={36} color="primary" />
              </Box>
            )}

            <Stack spacing={2}>
              <TextField
                label="Nom d'utilisateur ou numéro"
                error={!!errors.username}
                helperText={errors.username?.message || ''}
                {...register('username', {
                  required: 'Le nom d\'utilisateur est requis'
                })}
                fullWidth
                disabled={isSubmitting}
              />

              <TextField
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message || ''}
                {...register('password', {
                  required: 'Le mot de passe est requis'
                })}
                fullWidth
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color='success'
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                <Typography
                  component={Link}
                  to="/auth/register"
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
                  Inscription !
                </Typography>

                <Button variant="text" size="small" color='error' sx={{ textTransform: 'none' }} component={Link} to="/auth/mot_de_passe_oublier">
                  Mot de passe oublié ?
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ py: 1.5, textTransform: 'none', fontWeight: 700 }}
              >
                {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </Stack>
          </form>
        </CardContent>
        
      </Card>
    </Box>
  );
};

export default AuthLogin;

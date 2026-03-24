// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthMdp from './auth-forms/AuthMdp';

// ================================|| LOGIN ||================================ //

export default function Mdp() {  
  
    return (
      <AuthWrapper>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" >
            <Typography variant="h3">Mot De Passe Oublier ?</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthMdp />
        </Grid>
        {/* <Typography component={Link} to="/auth/mot_de_passe_oublier" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
          Mot de passe oublier ?
        </Typography> */}
      </Grid>
      </AuthWrapper>
    )
  }

import { FC } from 'react';
import { Grid } from '@mui/material';
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';

const Login: FC = () => {
  return (
    <AuthWrapper>
      <Grid container >
        
        <AuthLogin />
        
      </Grid>
    </AuthWrapper>
  );
};

export default Login;

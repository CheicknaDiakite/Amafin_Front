import { FC } from 'react';
import { Grid, Box } from '@mui/material';
// import { TypeAnimation } from 'react-type-animation';
import Logo from '../../components/logo';
// import AuthCard from './AuthCard';
import AuthBackground from '../../assets/images/auth/AuthBackground';
import { ChildrenProps } from '../../typescript/Account';

const AuthWrapper: FC<ChildrenProps> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* <AuthBackground /> */}
      <Grid 
        container 
        direction="column" 
        justifyContent="flex-end" 
        sx={{ minHeight: '100vh' }}
      >
        <Grid item xs={12} sx={{ ml: 3, mt: 3 }}>
          <Logo />
        </Grid>
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{ 
              minHeight: { 
                xs: 'calc(100vh - 210px)', 
                sm: 'calc(100vh - 134px)', 
                md: 'calc(100vh - 112px)' 
              } 
            }}
          >
            {/* <ContactAnimation /> */}
            <Grid item >
              {/* <AuthCard> */}
                {children}
              {/* </AuthCard> */}
            </Grid>
          </Grid>
        </Grid>
        
      </Grid>
    </Box>
  );
};

export default AuthWrapper;

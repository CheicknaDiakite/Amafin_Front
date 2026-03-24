import { FC } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Box, Typography } from '@mui/material';

const Bienvenue: FC = () => {
  return (
    <Box 
      component="div" 
      sx={{
        fontSize: { xs: '1.5rem', sm: '2rem' },
        fontWeight: 800,
        mb: 3
      }}
    >
      <Typography
        component="span"
        variant="h5"
        sx={{
          backgroundImage: 'linear-gradient(to right, #93C5FD, #86EFAC)',
          backgroundClip: 'text',
          color: 'transparent',
          animation: 'gradient 3s ease infinite',
          display: 'inline-block',
          '@keyframes gradient': {
            '0%': {
              backgroundPosition: '0% 50%'
            },
            '50%': {
              backgroundPosition: '100% 50%'
            },
            '100%': {
              backgroundPosition: '0% 50%'
            }
          }
        }}
      >
        <TypeAnimation
          sequence={[
            'Bienvenue sur Gest Stocks',
            1000
          ]}
          wrapper="span"
          speed={50}
          repeat={Infinity}
          style={{ display: 'inline-block' }}
        />
      </Typography>
    </Box>
  );
};

export default Bienvenue;

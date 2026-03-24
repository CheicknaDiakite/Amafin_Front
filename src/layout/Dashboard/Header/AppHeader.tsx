import * as React from 'react';
import Box from '@mui/material/Box';
import HeaderContent from './HeaderContent';

import backgroundImage from '../../../../public/icon-192x192.png'

// ==============================|| HEADER - APP HEADER CONTENT ||============================== //

function AppHeader() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
      {/* Logo Section */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
          src={backgroundImage}
          alt="Amafin Logo"
          sx={{
            height: 42,
            width: 'auto',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
            }
          }}
        />
      </Box>

      {/* Main Content (Search, Profile, Notifications) */}
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}>
        <HeaderContent />
      </Box>
    </Box>
  );
}

export default AppHeader;

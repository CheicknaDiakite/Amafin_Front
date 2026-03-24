import { Box, Typography } from '@mui/material';
import { ChartSectionProps } from '../types';

export const ChartSection: React.FC<ChartSectionProps> = ({ title, children, className }) => {
  return (
    <Box className={`mb-6 ${className}`}>
      <Box
        className="mb-3 p-2 rounded-lg"
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
        }}
      >
        <Typography
          variant="h5"
          className="text-white font-semibold"
          sx={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box
        className="rounded-lg"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}; 
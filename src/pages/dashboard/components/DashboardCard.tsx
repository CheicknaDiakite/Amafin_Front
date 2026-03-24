import { Box, Typography } from '@mui/material';
import { DashboardCardProps } from '../types';

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, className }) => {
  return (
    <Box
      className={`p-4 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm ${className}`}
      sx={{
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Typography
        variant="h6"
        className="mb-4 text-gray-700 font-semibold"
        sx={{
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          paddingBottom: 1,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}; 
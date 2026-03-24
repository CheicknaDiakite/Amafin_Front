import { Box, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { IconsGridProps } from '../types';

export const IconsGrid: React.FC<IconsGridProps> = ({ icon, title, description, className, link }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Link to={link} className="block">
      <Box
        className={`p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
        sx={{
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Box
          className="icon text-4xl mb-4 flex justify-center"
          sx={{
            color: isDarkMode ? 'primary.light' : 'primary.main',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          className="text-center font-semibold mb-2"
          sx={{
            color: isDarkMode ? 'common.white' : 'text.primary',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: isDarkMode ? 'primary.light' : 'primary.main',
            },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          className="text-center"
          sx={{
            color: isDarkMode ? 'grey.300' : 'text.secondary',
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Link>
  );
}; 
import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from '../../../../components/logo';

// ==============================|| DRAWER HEADER ||============================== //

interface DrawerHeaderProps {
  open: boolean;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({ open }) => {
  const theme = useTheme();

  return (
    <DrawerHeaderStyled theme={theme} open={open}>
      <Logo sx={{ width: open ? 'auto' : 35, height: 35 }} />
    </DrawerHeaderStyled>
  );
};

DrawerHeader.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default DrawerHeader;

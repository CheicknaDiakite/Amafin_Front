import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import AppBar, { AppBarProps } from '@mui/material/AppBar';

// project import
import { drawerWidth } from '../../../config';

// ==============================|| HEADER - APP BAR STYLED ||============================== //

// Définir un type pour inclure 'open'
interface AppBarStyledProps extends AppBarProps {
  open?: boolean;
}

// Utiliser StyledComponent pour créer AppBarStyled avec le type explicite
const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarStyledProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  left: 0,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(!open && {
    width: `calc(100% - ${theme.spacing(7.5)})`
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

AppBarStyled.propTypes = {
  open: PropTypes.bool
};

// Assurez-vous que le type exporté est également explicite
export default AppBarStyled as React.FC<AppBarStyledProps>;

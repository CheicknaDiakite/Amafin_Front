// material-ui
import { styled } from '@mui/material/styles';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import { Theme } from '@mui/material/styles/createTheme'; // Importer le type Theme

// project import
import { drawerWidth } from '../../../config';

// Définition des types pour les mixins
const openedMixin = (theme: Theme): React.CSSProperties => ({
  width: drawerWidth,
  borderRight: '1px solid',
  borderRightColor: theme.palette.divider,

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),

  overflowX: 'hidden',
  boxShadow: 'none',
});

const closedMixin = (theme: Theme): React.CSSProperties => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  overflowX: 'hidden',
  width: 0,
  borderRight: 'none',
  boxShadow: theme.customShadows.z1,
});

// ==============================|| DRAWER - MINI STYLED ||============================== //

interface MiniDrawerStyledProps extends DrawerProps {
  open: boolean; // Prop pour contrôler l'état ouvert/fermé
}

// Ajout de l'annotation de type explicite
const MiniDrawerStyled: any = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<MiniDrawerStyledProps>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default MiniDrawerStyled;

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { BoxProps } from '@mui/material/Box';

// Définir les types pour le composant stylé
interface DrawerHeaderStyledProps extends BoxProps {
  open: boolean;
}

// Créer le composant stylé
const DrawerHeaderStyled: any = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<DrawerHeaderStyledProps>(({ theme, open }) => ({
  ...theme.mixins.toolbar,
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'flex-start' : 'center',
  paddingLeft: theme.spacing(open ? 3 : 0),
}));

export default DrawerHeaderStyled;

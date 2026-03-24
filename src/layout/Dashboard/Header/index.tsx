import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar, { AppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import backgroundImage from '../../../../public/assets/img/img.jpg'
// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

import { handlerDrawerOpen, useGetMenuMaster } from '../../../api/menu';

// assets
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useLocation, useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //
interface AppBarStyledProps extends AppBarProps {
  open?: boolean;
}
export default function Header() {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  // header content
  const headerContent = useMemo(() => <AppHeader />, []);

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';

  // common header
  const mainHeader = (
    <Toolbar
      sx={{
        minHeight: '64px',
        px: { xs: 2, sm: 3, md: 4 }
      }}
    >
      {/* Si on est sur la page d'accueil : afficher le bouton menu, sinon bouton retour */}
      {!isHome && (
        <IconButton
          disableRipple
          aria-label="go back"
          onClick={() => navigate(-1)}
          edge="start"
          color="secondary"
          sx={{
            color: 'text.primary',
            bgcolor: 'rgba(0, 0, 0, 0.05)',
            mr: 2,
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.1)' }
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: '1.2rem' }} />
        </IconButton>
      )}

      <AppHeader />
    </Toolbar>
  );

  // app-bar params
  const appBar: AppBarStyledProps = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
    sx: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    open: drawerOpen
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
}

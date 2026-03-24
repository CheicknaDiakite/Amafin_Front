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
  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColor = 'grey.100';
  const iconBackColorOpen = 'grey.200';

  // common header
  const mainHeader = (
    <Toolbar 
    style={{ 
      background: `linear-gradient(rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.7)) center center`, 
      backgroundSize: 'contain', // Peut être 'cover' ou 'contain' selon votre besoin
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      
    }}
    >
      {/* Si on est sur la page d'accueil : afficher le bouton menu, sinon bouton retour */}
      {isHome ? (
        // <IconButton
        //   disableRipple
        //   aria-label="open drawer"
        //   onClick={() => handlerDrawerOpen(!drawerOpen)}
        //   edge="start"
        //   color="secondary"
        //   sx={{ color: 'text.primary', bgcolor: drawerOpen ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
        // >
        //   {!drawerOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        // </IconButton>
        ''
      ) : (
        <IconButton
          disableRipple
          aria-label="go back"
          onClick={() => navigate(-1)}
          edge="start"
          color="secondary"
          sx={{ color: 'text.primary', bgcolor: iconBackColor, ml: { xs: 0, lg: -2 } }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}
      
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar: AppBarStyledProps = {
    position: 'fixed',
    color: 'transparent', // Utilisez une couleur valide ici
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    open: drawerOpen // Ajoutez l'état 'open' si nécessaire
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

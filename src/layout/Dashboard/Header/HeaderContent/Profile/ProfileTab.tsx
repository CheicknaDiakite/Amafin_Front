import PropTypes from 'prop-types';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/BorderColor';

// assets
import LogoutIcon from '@mui/icons-material/Logout';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import { connect } from '../../../../../_services/account.service';
import { Link } from 'react-router-dom';
import { useFetchUser } from '../../../../../usePerso/fonction.user';
import { Box, Skeleton } from '@mui/material';
import { logout } from '../../../../../usePerso/fonctionPerso';


// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

export default function ProfileTab() {
  const {unUser, isLoading, isError} = useFetchUser(connect)
  
  if (isLoading) {
    // return <div>Chargement...</div>;
    
      return (
        <Box sx={{ width: 300 }}>
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
          {/* <Skeleton animation="wave" variant="circular" width={40} height={40} /> */}
          {/* <Skeleton animation="wave" /> */}
          {/* <Skeleton animation={false} /> */}
        </Box>
      );

  }
  
  // if (isError) {
  //   window.location.reload();
  //   return <div>Une erreur s'est produite</div>;
  // }

  if (unUser) {
    return (
      <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
        <Link to={`/utilisateur/modif/${unUser.uuid}`}>
          <ListItemButton >
            <ListItemIcon>
              <EditIcon color="primary" fontSize="small"/>
            </ListItemIcon>
            <ListItemText primary="modifier votre profile" />
          </ListItemButton>
        </Link>
        {unUser.role === 1 && 
          <Link to={"/personnel"}>
            <ListItemButton >
              <ListItemIcon>
                <PeopleOutlineRoundedIcon color="primary" />
              </ListItemIcon>
                <ListItemText primary="Voir les utilisateurs" />            
            </ListItemButton>
          </Link>
        }
        {(unUser.role === 1 || unUser.role === 2 || unUser.role === 3) && 
        
        <Link to={"/client"}>
          <ListItemButton >
            <ListItemIcon>
              <PeopleOutlineRoundedIcon color="primary" />
            </ListItemIcon>
              <ListItemText primary="Voir les clients ou fournisseurs" />            
          </ListItemButton>
        </Link>
        }
        
        {unUser.role === 1 && <>        
        <Link to={"/detail"}>
          <ListItemButton >
            <ListItemIcon>
              <AddBusinessIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Entreprise" />
          </ListItemButton>
        </Link>
        </>
        }
        <ListItemButton onClick={logout} >
          <ListItemIcon>
            <LogoutIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    );
  }
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };

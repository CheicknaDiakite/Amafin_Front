import { 
  Alert, 
  Avatar, 
  Box, 
  Chip, 
  CircularProgress, 
  Container,
  IconButton,
  List,
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  Paper,
  Tooltip,
  Button,
  Typography,
  Fade
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { connect } from '../../../../../_services/account.service';
import { useGetEntrepriseUsers, useRemoveUserEntreprise } from '../../../../../usePerso/fonction.user';
import { useStoreUuid } from '../../../../../usePerso/store';
import { useState, useEffect } from 'react';
import '../../mobile-admin.css';

export default function InfoUsers() {
  const uuid = useStoreUuid((state) => state.selectedId);
  const { entrepriseUsers, isLoading, isError } = useGetEntrepriseUsers(uuid!);
  const { removeEntreprise } = useRemoveUserEntreprise();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDelete = (userId: string) => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir retirer cet utilisateur de l'entreprise ?");
    if (confirmation) {
      removeEntreprise({
        entreprise_id: uuid!,
        user_id: userId,
        admin_id: connect,
      });
    }
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center p-8">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert 
        severity="error" 
        className="m-4"
        action={
          <Button color="inherit" size="small" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        }
      >
        Problème de connexion ! Veuillez réessayer.
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" className={`py-8 ${isMobile ? 'mobile-users-container' : ''}`}>
      <div className={`mb-6 ${isMobile ? 'mobile-animate-in' : ''}`}>
        <Typography variant="h4" className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'mobile-users-title' : ''}`}>
          Utilisateurs de l'entreprise
        </Typography>
        <Typography variant="body1" className={`text-gray-500 ${isMobile ? 'mobile-users-subtitle' : ''}`}>
          {entrepriseUsers?.length || 0} utilisateur{entrepriseUsers?.length !== 1 ? 's' : ''} enregistré{entrepriseUsers?.length !== 1 ? 's' : ''}
        </Typography>
      </div>

      <Paper elevation={0} className={`border rounded-lg overflow-hidden ${isMobile ? 'mobile-users-list' : ''}`}>
        <List className="divide-y">
          {entrepriseUsers?.map((user, index) => (
            <ListItem
              key={index}
              className={`hover:bg-gray-50 transition-colors ${isMobile ? 'mobile-user-item' : ''}`}
              secondaryAction={
                user.uuid === connect ? (
                  <Tooltip 
                    title="Administrateur" 
                    arrow 
                    TransitionComponent={Fade}
                  >
                    <IconButton disabled className={`text-green-600 ${isMobile ? 'mobile-action-button' : ''}`}>
                      <AdminPanelSettingsIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip 
                    title="Retirer l'utilisateur" 
                    arrow 
                    TransitionComponent={Fade}
                  >
                    <IconButton 
                      onClick={() => handleDelete(user.uuid!)}
                      className={`text-red-600 hover:bg-red-50 ${isMobile ? 'mobile-action-button' : ''}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )
              }
            >
              <ListItemAvatar>
                <Avatar className={`${user.uuid === connect ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'} ${isMobile ? 'mobile-user-avatar' : ''}`}>
                  {user.uuid === connect ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <div className={`flex items-center gap-2 ${isMobile ? 'mobile-user-info' : ''}`}>
                    <span className={`font-medium ${isMobile ? 'mobile-user-name' : ''}`}>{user.username}</span>
                    {user.uuid === connect && (
                      <Chip
                        label="Admin"
                        size="small"
                        className={`bg-green-100 text-green-600 text-xs ${isMobile ? 'mobile-user-role' : ''}`}
                      />
                    )}
                  </div>
                }
                secondary={
                  <Typography variant="body2" className={`text-gray-500 ${isMobile ? 'mobile-user-fullname' : ''}`}>
                    {user.last_name} {user.first_name}
                  </Typography>
                }
              />
            </ListItem>
          ))}

          {(!entrepriseUsers || entrepriseUsers.length === 0) && (
            <ListItem className={isMobile ? 'mobile-user-item' : ''}>
              <ListItemText
                primary={
                  <Typography className={`text-center text-gray-500 py-8 ${isMobile ? 'mobile-text-center' : ''}`}>
                    Aucun utilisateur enregistré
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Container>
  );
}
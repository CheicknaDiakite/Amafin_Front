import * as React from 'react';
import { Box, Paper, IconButton, Alert, Button } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router-dom';
import { ClientModif } from './ModifClient/ClientModif';
import { useDeleteClient, useUnClient } from '../../../usePerso/fonction.user';
import Nav from '../../../_components/Button/Nav';
import { connect } from '../../../_services/account.service';
import { a11yProps } from '../../../usePerso/fonctionPerso';
import { CustomTabPanel } from '../../../usePerso/useEntreprise';
import ClientEntrer from './Entrer/ClientEntrer';
import ClientSortie from './Sortie/ClientSortie';

export default function ClientInfo() {
  const { uuid } = useParams();
  const {unClient} = useUnClient(uuid!);
  
  unClient["user_id"] = connect;
  
  const {deleteClient} = useDeleteClient();
  const [value, setValue] = React.useState(0);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteClient(unClient);
    setShowConfirm(false);
  };

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Nav>
            <IconButton 
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Nav>
        </div>

        {showConfirm && (
          <Alert 
            severity="warning" 
            className="mt-4"
            action={
              <div className="space-x-2">
                <Button color="inherit" size="small" onClick={() => setShowConfirm(false)}>
                  Annuler
                </Button>
                <Button color="error" size="small" onClick={confirmDelete}>
                  Confirmer
                </Button>
              </div>
            }
          >
            Êtes-vous sûr de vouloir supprimer ce client ?
          </Alert>
        )}

        {/* Main Content */}
        <Paper elevation={0} className="rounded-lg overflow-hidden">
          <Box sx={{ width: '100%' }}>
            {/* Tabs */}
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: 'white',
            }}>
              <Tabs 
                value={value} 
                onChange={handleChange} 
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="client tabs"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: '64px',
                    textTransform: 'none',
                    fontSize: '0.95rem',
                  },
                  '& .Mui-selected': {
                    color: '#1976d2',
                  },
                }}
              >
                <Tab 
                  label={
                    <div className="flex items-center space-x-2">
                      <ShoppingCartIcon fontSize="small" />
                      <span>Ventes (Client)</span>
                    </div>
                  }
                  {...a11yProps(0)} 
                />

                <Tab 
                  label={
                    <div className="flex items-center space-x-2">
                      <LocalShippingIcon fontSize="small" />
                      <span>Achats (Fournisseur)</span>
                    </div>
                  }
                  {...a11yProps(1)} 
                />

                <Tab 
                  label={
                    <div className="flex items-center space-x-2">
                      <EditIcon fontSize="small" />
                      <span>Modification</span>
                    </div>
                  }
                  {...a11yProps(2)} 
                />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <div className="bg-white">
              <CustomTabPanel value={value} index={0}>
                <ClientSortie uuid={uuid!} />
              </CustomTabPanel>
              
              <CustomTabPanel value={value} index={1}>
                <ClientEntrer uuid={uuid!} />
              </CustomTabPanel>

              <CustomTabPanel value={value} index={2}>
                <ClientModif uuid={uuid!} />
              </CustomTabPanel>
            </div>
          </Box>
        </Paper>
      </div>
    </div>
  );
}

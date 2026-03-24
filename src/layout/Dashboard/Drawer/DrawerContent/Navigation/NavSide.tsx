import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Stack,
  Box,
  DialogActions
} from "@mui/material";
import {
  BarChart as DashboardIcon,
  Category as CategoryIcon,
  AddCircle as AddCircleIcon,
  ExitToApp as ExitToAppIcon,
  AccountCircle as UserCircleIcon,
  PowerSettingsNew as PowerIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DescriptionIcon from '@mui/icons-material/Description';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link } from "react-router-dom";
import { connect } from "../../../../../_services/account.service";
import { useAddAvis, useFetchEntreprise, useFetchUser, useGetUserEntreprises } from "../../../../../usePerso/fonction.user";
import { logout } from "../../../../../usePerso/fonctionPerso";
import { useStoreUuid } from "../../../../../usePerso/store";
import { BASE } from "../../../../../_services/caller.service";
import MyTextField from "../../../../../_components/Input/MyTextField";
import { AvisType } from "../../../../../typescript/UserType";
import Example from "../../../../../boutique/Ct";

// Types
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  to?: string;
  bgColor?: string;
  isExpanded?: boolean;
}

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  values: AvisType;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Components
const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, to, bgColor, isExpanded }) => {
  const content = (
    <ListItem 
      button 
      onClick={onClick}
      sx={{
        borderRadius: 1,
        mb: 0.5,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        {icon}
      </ListItemIcon>
      <Typography 
        className={`${bgColor} px-2 py-1 rounded transition-colors duration-200`}
      >
        {label}
      </Typography>
      {isExpanded !== undefined && (
        isExpanded ? <ExpandLess /> : <ExpandMore />
      )}
    </ListItem>
  );

  return to ? <Link to={to} className="block">{content}</Link> : content;
};

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onClose, onSubmit, values, onChange }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Donnez votre avis</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent>
        <Stack spacing={3}>
          <MyTextField
            label="Titre"
            name="libelle"
            value={values.libelle}
            onChange={onChange}
            required
          />
          <MyTextField
            label="Description"
            name="description"
            value={values.description}
            onChange={onChange}
            multiline
            rows={4}
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Envoyer
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);

const NavSide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<number>(0);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const { unUser } = useFetchUser();
  const uuid = useStoreUuid((state) => state.selectedId);
  const { unEntreprise } = useFetchEntreprise(uuid);
  const { userEntreprises } = useGetUserEntreprises();
  const addId = useStoreUuid(state => state.addId);
  const { createAvis } = useAddAvis();

  const [avisValues, setAvisValues] = useState<AvisType>({
    libelle: "",
    description: "",
    user_id: "",
  });

  const handleSectionExpand = (section: number): void => {
    setExpandedSection(expandedSection === section ? 0 : section);
  };

  const handleAvisChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAvisValues(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvisSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createAvis({
      ...avisValues,
      user_id: connect,
    });
    setAvisValues({ libelle: "", description: "", user_id: "" });
    setFeedbackDialogOpen(false);
  };

  const logoUrl = unEntreprise.image ? BASE(unEntreprise.image) : "/icon-192x192.png";

  return (
    <Card 
      sx={{ 
        height: "calc(100vh - 2rem)", 
        maxWidth: "20rem", 
        p: 2, 
        boxShadow: 3,
        background: `linear-gradient(rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.7)), url(${logoUrl}) center/cover no-repeat`,
      }}
    >
        <CardContent className="text-white border border-indigo-600 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 flex items-center gap-2 p-2 rounded border-dashed animate-border-rotate cursor-pointer">
          
          <Link to="/">
            <img
              src={logoUrl}
              alt={unEntreprise.nom ? unEntreprise.nom : "Gest_Stocks"}
              className="h-8 w-8 object-contain rounded-full"
            />
          </Link>

          <Typography variant="h5">
            {unEntreprise.nom ? unEntreprise.nom : "Gest Stocks"}
          </Typography>

        </CardContent>

      <List>
        <NavItem
          icon={<AddBusinessIcon color="primary" />}
          label="Entreprise(s)"
          onClick={() => handleSectionExpand(5)}
          bgColor="text-white bg-gray-500"
          isExpanded={expandedSection === 5}
        />

        <Collapse in={expandedSection === 5} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {userEntreprises?.map((entreprise) => (
              <NavItem
                key={entreprise.uuid}
                icon={null}
                label={entreprise.nom}
                onClick={() => {
                  addId(entreprise.uuid!);
                  window.location.reload();
                }}
                to="/entreprise"
                bgColor="text-black bg-white"
              />
            ))}
          </List>
        </Collapse>

        {uuid && (
          <>
            <NavItem
              icon={<DashboardIcon color="primary" />}
              label="Accueil"
              onClick={() => handleSectionExpand(1)}
              bgColor="text-white bg-gray-900"
              isExpanded={expandedSection === 1}
            />

            {(unUser.role === 1 || unUser.role === 2 || unUser.role === 3) && (
              <Collapse in={expandedSection === 1} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {(unUser.role === 1 || unUser.role === 2) && (
                    <>
                      <NavItem
                        icon={<CategoryIcon />}
                        label="Article"
                        to="/categorie"
                        bgColor="text-black bg-white"
                      />
                      <NavItem
                        icon={<AddCircleIcon color="success" />}
                        label="Entrer (Achat)"
                        to="/entre"
                        bgColor="text-white bg-green-500"
                      />
                    </>
                  )}
                  <NavItem
                    icon={<ExitToAppIcon color="error" />}
                    label="Sortie (Vente)"
                    to="/sortie"
                    bgColor="text-white bg-red-500"
                  />
                  <NavItem
                    icon={<ExitToAppIcon color="error" />}
                    label="Remise Facture"
                    to="/sortie/remise"
                    bgColor="text-white bg-red-400"
                  />
                </List>
              </Collapse>
            )}
          </>
        )}

        {((unUser.role === 1 || unUser.role === 2) && uuid) && 
        <>        
        {/* Inventaier Par moi */}
        <NavItem
          icon={<HistoryEduIcon color="primary" />}
          label="Inventaire"
          onClick={() => handleSectionExpand(2)}
          bgColor="text-white bg-gray-900"
          isExpanded={expandedSection === 2}
        />
        <Collapse in={expandedSection === 2} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            <NavItem
              icon={null}
              label="Sortie"
              to="/entreprise/inventaire/sortie"
              bgColor="text-white bg-gray-500"
            />
    
            <NavItem
              icon={null}
              label="Etat des produits"
              to="/entreprise/inventaire/EtaDesProduits"
              bgColor="text-white bg-gray-500"
            />
            {(unUser.role === 1 && uuid) && 
              <NavItem
                icon={null}
                label="Etat des utilisateurs"
                to="/entreprise/inventaire/VenteUsers"
                bgColor="text-white bg-gray-500"
              />
            }
          
          </List>
        </Collapse>
        </>
        }

        {(unUser.role === 1 && uuid) && 
        <>
        {/*  */}
        <NavItem
          icon={<HistoryEduIcon color="primary" />}
          label="Historique"
          onClick={() => handleSectionExpand(3)}
          bgColor="text-white bg-gray-900"
          isExpanded={expandedSection === 3}
        />
        <Collapse in={expandedSection === 3} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavItem
              icon={null}
              label="Historique d'entrer et sortie"
              to="/entreprise/historique"
              bgColor="text-white bg-gray-500"
            />
                      
            <NavItem
              icon={null}
              label="Historique des suppressions"
              to="/entreprise/historique/sppression"
              bgColor="text-white bg-gray-500"
            />
          
          </List>
        </Collapse>
        </>
        }

        {(unUser.role === 1 && unUser.is_superuser ) && <>
        
            <NavItem
              icon={<UserCircleIcon color="primary" />}
              label="Les Admin"
              to="/user/admin"
              bgColor="text-white bg-blue-900"
            />
            
            <NavItem
              icon={<UserCircleIcon color="primary" />}
              label="Les Avis"
              to="/user/avis"
              bgColor="text-white bg-blue-900"
            />
          </>
        }

        {(unUser.role === 1 && unUser.is_cabinet ) && <>        
        <NavItem
          icon={<UserCircleIcon color="primary" />}
          label="Mes inscrits"
          to="/user/mesInscrit"
          bgColor="text-white bg-blue-900"
        />
        </>
        }
        
        <NavItem
          icon={<DescriptionIcon color="primary" />}
          label="Documentation"
          to="https://documentation.gest-stocks.com"
          bgColor="text-white bg-sky-900"
        />

        <NavItem
          icon={<HelpOutlineIcon color="primary" />}
          label="Que pensez-vous ?"
          onClick={() => setFeedbackDialogOpen(true)}
          bgColor="text-white bg-sky-900"
        />

        {(unUser.role === 1 || unUser.role === 2) &&        
          <NavItem
            icon={<HelpOutlineIcon color="primary" />}
            label="Abonnement ?"
            onClick={() => setHelpDialogOpen(true)}
            bgColor="text-white bg-sky-900"
          />
        }

        <NavItem
          icon={<PowerIcon color="error" />}
          label="Déconnexion"
          onClick={logout}
          bgColor="text-white bg-red-600"
        />
        
      </List>

      <FeedbackDialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        onSubmit={handleAvisSubmit}
        values={avisValues}
        onChange={handleAvisChange}
      />

      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Aide</Typography>
            <IconButton onClick={() => setHelpDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Example />
        </DialogContent>
      </Dialog>

      <Typography variant="h5" className="text-white bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 px-2 py-1 rounded border border-dashed animate-border-rotate">
        <a
          href="https://wa.me/91154834"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon style={{ marginRight: 8 }} />
          +223 91 15 48 34
        </a>
      </Typography>
    </Card>
  );
};

export default NavSide;

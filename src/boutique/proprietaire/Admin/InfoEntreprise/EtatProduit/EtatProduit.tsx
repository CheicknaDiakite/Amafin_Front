import { 
  Alert, 
  Box, 
  CircularProgress, 
  Container,
  Grid, 
  Paper,
  Typography,
  Button
} from '@mui/material';
import { useFetchEntreprise, useStockEntreprise } from '../../../../../usePerso/fonction.user';
import { useStoreUuid } from '../../../../../usePerso/store';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useState, useEffect } from 'react';
import '../../mobile-admin.css';
import { LicenceTag } from '../../Entreprise';
import { getLicenceDuration } from '../../../../../usePerso/fonctionPerso';

// Ajoute ta fonction utilitaire si besoin
function isLicenceExpired(dateStr: string) {
  if (!dateStr) return false;
  const today = new Date();
  const exp = new Date(dateStr);
  return exp < today;
}


export default function EtatProduit() {
  const uuid = useStoreUuid((state) => state.selectedId);
  const { stockEntreprise, isLoading, isError } = useStockEntreprise(uuid || '');
  const { unEntreprise } = useFetchEntreprise(uuid);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  if (!stockEntreprise || !unEntreprise) return null;

  const licenceExpiree = isLicenceExpired(unEntreprise.licence_date_expiration);

  const stats = [
    {
      title: "Quantités sorties",
      value: stockEntreprise.somme_sortie_qte,
      icon: <TrendingDownIcon className="text-red-600" />,
      link: null,
      bgClass: "from-red-50 to-red-100",
      iconBgClass: "bg-red-100",
      textClass: "text-red-600"
    },
    {
      title: "Quantités en stock",
      value: stockEntreprise.somme_entrer_qte,
      icon: <InventoryIcon className="text-green-600" />,
      link: null,
      bgClass: "from-green-50 to-green-100",
      iconBgClass: "bg-green-100",
      textClass: "text-green-600"
    },
    {
      title: "Sorties effectuées",
      value: stockEntreprise.nombre_sortie,
      icon: <ShoppingCartIcon className="text-blue-600" />,
      link: "/sortie",
      bgClass: "from-blue-50 to-blue-100",
      iconBgClass: "bg-blue-100",
      textClass: "text-blue-600"
    },
    {
      title: "Entrées effectuées",
      value: stockEntreprise.nombre_entrer,
      icon: <TrendingUpIcon className="text-indigo-600" />,
      link: "/entre",
      bgClass: "from-indigo-50 to-indigo-100",
      iconBgClass: "bg-indigo-100",
      textClass: "text-indigo-600"
    }
  ];

  return (
    <Container maxWidth="lg" className={`py-8 ${isMobile ? 'mobile-stats-container' : ''}`}>
      <div className="flex flex-col items-center gap-2 mb-4">
        <LicenceTag type={unEntreprise.licence_type}>
          Licence {unEntreprise.licence_type} {getLicenceDuration(unEntreprise.licence_date_expiration)}
        </LicenceTag>
        {/* <p className="text-gray-600 text-sm">
          {getLicenceDuration(unEntreprise.licence_date_expiration)}
        </p> */}
        {licenceExpiree && (
          <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow mt-2">
            Licence expirée
          </span>
        )}
      </div>

      <div className={`mb-6 ${isMobile ? 'mobile-animate-in' : ''}`}>
        <Typography variant="h4" className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'mobile-stats-title' : ''}`}>
          Statistiques de l'entreprise
        </Typography>
        <Typography variant="body1" className={`text-gray-500 ${isMobile ? 'mobile-stats-subtitle' : ''}`}>
          Vue d'ensemble des mouvements de stock
        </Typography>
      </div>

      <Grid container spacing={3} className={isMobile ? 'mobile-stats-grid' : ''}>
        {stats.map((stat, index) => {
          const StatContent = () => (
            <Paper
              elevation={0}
              className={`border rounded-lg overflow-hidden h-full transition-all duration-200 hover:shadow-md bg-gradient-to-br ${stat.bgClass} ${isMobile ? 'mobile-stat-card' : ''} ${licenceExpiree ? 'opacity-60 grayscale' : ''}`}
            >
              <Box className={`p-6 ${isMobile ? 'mobile-responsive-stack' : ''}`}>
                <div className={`flex items-center justify-between mb-4 ${isMobile ? 'mobile-stat-header' : ''}`}>
                  <Typography variant="h6" className={`font-medium text-gray-900 ${isMobile ? 'mobile-stat-title' : ''}`}>
                    {stat.title}
                  </Typography>
                  <div className={`p-2 rounded-full ${stat.iconBgClass} ${isMobile ? 'mobile-stat-icon' : ''}`}>
                    {stat.icon}
                  </div>
                </div>
                <Typography variant="h4" className={`font-semibold ${stat.textClass} ${isMobile ? 'mobile-stat-value' : ''}`}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          );

          return (
            <Grid item xs={12} sm={6} md={3} key={index} className={isMobile ? 'mobile-animate-in' : ''}>
              {stat.link && !licenceExpiree ? (
                <Link to={stat.link} className="block h-full no-underline">
                  <StatContent />
                </Link>
              ) : (
                <StatContent />
              )}
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FlagIcon from '@mui/icons-material/Flag';
import { Link } from 'react-router-dom';
import { FC, useEffect, useMemo, useState } from 'react';
import { useFetchEntreprise, useFetchUser } from '../../usePerso/fonction.user';
import { useGetSumDepense } from '../../usePerso/fonction.entre';
import { useStoreUuid } from '../../usePerso/store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Paper,
  Container,
  Button,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import MonthlyBarChart from './MonthlyBarChart';
import './mobile-dashboard.css';
import MonthlyTarget from './MonthlyTarget';
import { Compte, getComptes } from '../../api/compte';
import { getTransacts, Transact } from '../../api/transac';

// ==============================|| DASHBOARD ||============================== //

interface NavigationCardType {
  icon: JSX.Element;
  title: string;
  description: string;
  to: string;
  gradient: string;
  iconBg: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
  gradient: string;
  percentage?: string;
  isIncrease?: boolean;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon, gradient, percentage, isIncrease }) => (
  <Paper
    elevation={0}
    className={`${gradient} rounded-2xl sm:rounded-3xl relative overflow-hidden h-full mobile-stats-card`}
    sx={{
      p: { xs: 2.5, sm: 3 },
      minHeight: { xs: 148, sm: 172 },
      border: '1px solid rgba(255, 255, 255, 0.22)',
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(12px)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '@media (hover: hover)': {
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (t) => `0 16px 32px ${alpha(t.palette.common.black, 0.12)}`,
        },
      },
    }}
  >
    <Box className="relative z-10 flex flex-col h-full justify-between">
      <Box className="flex justify-between items-start gap-2 mb-2">
        <Typography
          variant="subtitle2"
          className="text-white/95 font-semibold tracking-wide"
          sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' }, lineHeight: 1.35 }}
        >
          {title}
        </Typography>
        <Box
          className="bg-white/20 shrink-0 p-1.5 sm:p-2 rounded-xl text-white mobile-icon"
          sx={{ '& svg': { fontSize: { xs: 22, sm: 28 } } }}
        >
          {icon}
        </Box>
      </Box>
      <Box>
        <Typography
          variant="h3"
          className="text-white font-bold mb-1 break-words"
          sx={{
            fontSize: { xs: '1.15rem', sm: '1.65rem', md: '2rem' },
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          {value}
        </Typography>
        {percentage && (
          <Typography
            variant="caption"
            component="span"
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-white/95 ${isIncrease ? 'bg-emerald-500/35' : 'bg-rose-500/35'}`}
            sx={{ letterSpacing: 0.3, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
          >
            {percentage} {isIncrease ? '↑' : '↓'} vs mois précédent
          </Typography>
        )}
      </Box>
    </Box>
    <Box className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
  </Paper>
);

const NavigationCard: FC<NavigationCardType> = ({ icon, title, description, to, gradient, iconBg }) => (
  <Link to={to} className="block h-full no-underline">
    <Paper
      elevation={0}
      className="h-full rounded-xl sm:rounded-[20px] mobile-nav-card mobile-hover-effect border border-gray-100/80 p-3.5 sm:p-5 group mobile-glass"
      sx={{
        minHeight: { xs: 118, sm: 142 },
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        '@media (hover: hover)': {
          '&:hover': {
            borderColor: 'transparent',
            boxShadow: (t) => `0 12px 28px ${alpha(t.palette.grey[900], 0.08)}`,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', h: '100%' }}>
        <Box
          className={`${iconBg} ${gradient} w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl mb-3 flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 mobile-icon`}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          className="font-bold text-gray-50 mb-0.5"
          sx={{ fontSize: { xs: '0.82rem', sm: '1rem' }, lineHeight: 1.3 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          className="text-gray-200 line-clamp-2"
          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, lineHeight: 1.35 }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  </Link>
);

function SectionHeader({
  title,
  subtitle,
  aside,
}: {
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
}) {
  return (
    <Box
      
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'flex-end' },
        justifyContent: 'space-between',
        gap: 1.5,
        mb: { xs: 2, sm: 2.5 },
      }}
    >
      <Box>
        <Typography
          variant="overline"
          className='text-gray-50'
          sx={{ color: 'text.secondary', letterSpacing: 1.2, fontWeight: 600, fontSize: '0.65rem' }}
        >
          {subtitle}
        </Typography>
        <Typography className='text-gray-100' variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
          {title}
        </Typography>
      </Box>
      {aside}
    </Box>
  );
}

export default function DashboardDefault() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [transactions, setTransactions] = useState<Transact[]>([]);

  const userData = useFetchUser();
  const unUser = userData.unUser;
  const uuid = useStoreUuid((state) => state.selectedId);
  const entrepriseData = useFetchEntreprise(uuid);
  const unEntreprise = entrepriseData.unEntreprise;

  // Récupération des sommes de dépenses par mois (Modèle Depense)
  const { depensesSum } = useGetSumDepense();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [txs, cps] = await Promise.all([getTransacts(), getComptes()]);
        if (cancelled) return;
        const txArray = Array.isArray(txs) ? [...txs] : [];
        txArray.sort((a, b) => {
          const ta = a.created_at ? new Date(a.created_at).getTime() : Number(a.id ?? 0);
          const tb = b.created_at ? new Date(b.created_at).getTime() : Number(b.id ?? 0);
          return tb - ta;
        });
        setTransactions(txArray);
        setComptes(Array.isArray(cps) ? cps : []);
      } catch {
        setHasError(true);
        setErrorMessage('Impossible de charger les données financières.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalSolde = useMemo(
    () => comptes.reduce((acc, c) => acc + Number(c.solde || 0), 0),
    [comptes],
  );

  /**
   * Calcul du total des dépenses pour le mois en cours.
   * On se base sur les données retournées par l'API get_depenses_somme (modèle Depense).
   */
  const currentMonthExpenseTotal = useMemo(() => {
    try {
      const now = new Date();
      const currentMonthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(now).toLowerCase();
      const currentYear = now.getFullYear();
      const searchKey = `${currentMonthName} ${currentYear}`;

      const currentMonthEntry = depensesSum?.find((d) => d.mois.trim().toLowerCase() === searchKey);
      return currentMonthEntry ? Number(currentMonthEntry.total) : 0;
    } catch (e) {
      console.error("Erreur calcul depense mois", e);
      return 0;
    }
  }, [depensesSum]);

  const lastMonthTotal = currentMonthExpenseTotal; // On remplace l'ancienne logique par la nouvelle

  const revenue = typeof totalSolde === 'number' ? totalSolde - lastMonthTotal : null;

  const percentBudgetRestant = useMemo(() => {
    if (typeof totalSolde === 'number' && totalSolde > 0 && revenue !== null) {
      const raw = (revenue / totalSolde) * 100;
      return Math.max(-100, Math.min(100, Math.round(raw * 100) / 100));
    }
    return 0;
  }, [totalSolde, revenue]);

  const navigationCards = useMemo(
    () => [
      {
        icon: <CategoryIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Nature de la dépense',
        description: 'Catégories et libellés',
        gradient: 'bg-premium-indigo',
        iconBg: 'bg-white/20',
        to: '/categorie',
      },
      {
        icon: <SavingsIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Budgets',
        description: 'Budgets suivis',
        gradient: 'bg-premium-emerald',
        iconBg: 'bg-white/20',
        to: '/budget',
      },
      {
        icon: <AccountBalanceWalletIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Transactions',
        description: 'Historique des flux',
        gradient: 'bg-premium-blue',
        iconBg: 'bg-white/20',
        to: '/transaction',
      },
      {
        icon: <FlagIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Objectifs',
        description: 'Objectifs financiers',
        gradient: 'bg-premium-amber',
        iconBg: 'bg-white/20',
        to: '/objectif',
      },
      {
        icon: <MonetizationOnIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Dépenses',
        description: 'Saisie des dépenses',
        gradient: 'bg-premium-rose',
        iconBg: 'bg-white/20',
        to: '/depense',
      },
    ],
    [],
  );

  if (!unUser || !unEntreprise) {
    return (
      <Box
        className="flex items-center justify-center min-h-screen mobile-loading"
        sx={{ px: 2 }}
        role="status"
        aria-label="Chargement du tableau de bord"
      >
        <CircularProgress size={isXs ? 48 : 60} />
      </Box>
    );
  }

  if (hasError) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 3 } }}>
        <Alert
          severity="error"
          className="shadow-lg rounded-2xl mobile-alert"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setHasError(false);
                window.location.reload();
              }}
              className="mobile-button"
            >
              Réessayer
            </Button>
          }
        >
          {errorMessage || 'Une erreur est survenue. Réessayez dans un instant.'}
        </Alert>
      </Container>
    );
  }

  const welcomeName =
    [unUser.first_name, unUser.last_name].filter(Boolean).join(' ').trim() ||
    unUser.username?.trim() ||
    'Utilisateur';
  const dateLabel = format(new Date(), 'EEEE d MMMM yyyy', { locale: fr });

  return (
    <Box
      component="main"
      className="min-h-screen mobile-container"
    // sx={{
    //   bgcolor: 'grey.50',
    //   pb: { xs: 'max(24px, env(safe-area-inset-bottom))', sm: 6 },
    //   pt: { xs: 'max(8px, env(safe-area-inset-top))', sm: 0 },
    // }}
    >
      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: { lg: '1280px !important' },
        }}
      >
        <Stack spacing={{ xs: 3, sm: 4 }}>
          {/* En-tête */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 2, md: 3 },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                component="h1"
                className="font-bold text-gray-50 mb-0.5"
                sx={{
                  fontWeight: 800,
                  
                  fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2rem' },
                  lineHeight: 1.25,
                  mb: 0.5,
                }}
              >
                Tableau de bord
              </Typography>
              <Typography
                variant="body2"
                className="font-bold text-gray-100 mb-0.5"
                sx={{
                  
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.5,
                }}
              >
                Bienvenue, {welcomeName}. Synthèse de votre activité financière.
              </Typography>
            </Box>
            <Paper
              elevation={0}
              sx={{
                alignSelf: { xs: 'stretch', md: 'center' },
                px: { xs: 2, sm: 2.5 },
                py: { xs: 1.25, sm: 1.5 },
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  flexShrink: 0,
                  animation: 'pulse 2s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.45 },
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  textTransform: 'capitalize',
                }}
              >
                {dateLabel}
              </Typography>
            </Paper>
          </Box>

          {/* KPIs */}
          <Box component="section" aria-label="Indicateurs clés">
            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Solde total"
                  value={`${totalSolde.toLocaleString('fr-FR')} FCFA`}
                  icon={<AccountBalanceWalletIcon />}
                  gradient="bg-premium-indigo"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Dépenses du mois"
                  value={`${lastMonthTotal.toLocaleString('fr-FR')} FCFA`}
                  icon={<MonetizationOnIcon />}
                  gradient="bg-premium-rose"
                  percentage="12%"
                  isIncrease={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Budget restant"
                  value={`${percentBudgetRestant}%`}
                  icon={<SavingsIcon />}
                  gradient="bg-premium-emerald"
                  percentage="5%"
                  isIncrease
                />
              </Grid>
            </Grid>
          </Box>

          {/* Graphiques */}
          <Box component="section" aria-label="Graphiques et objectifs mensuels">
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              <Grid item xs={12} lg={8}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: { xs: 2, sm: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                    height: '100%',
                    boxShadow: (t) => `0 1px 3px ${alpha(t.palette.common.black, 0.06)}`,
                  }}
                >
                  <Box
                    sx={{
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1.75, sm: 2.25 },
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Dépenses par mois
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
                      <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        Données à jour
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, minWidth: 0 }}>
                    <MonthlyBarChart />
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: { xs: 2, sm: 3 },
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                    height: '100%',
                    boxShadow: (t) => `0 1px 3px ${alpha(t.palette.common.black, 0.06)}`,
                  }}
                >
                  <MonthlyTarget />
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Actions rapides */}
          <Box component="section" aria-label="Raccourcis vers les modules" sx={{ pb: { xs: 1, sm: 0 } }}>
            <SectionHeader title="Raccourcis" subtitle="Navigation" />
            <Grid container spacing={isMobile ? 1.5 : 2}>
              {navigationCards.map((card) => (
                <Grid item xs={6} sm={4} md={2.4} key={card.to}>
                  <NavigationCard {...card} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

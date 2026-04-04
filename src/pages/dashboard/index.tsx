// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
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
import MiniExpenseChart from './MiniExpenseChart';
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
      className="h-full rounded-xl sm:rounded-[20px] mobile-nav-card mobile-hover-effect border border-gray-500/80 p-3.5 sm:p-5 group mobile-glass"
      sx={{
        minHeight: { xs: 118, sm: 142 },
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: (t) => ({ xs: `0 4px 16px ${alpha(t.palette.grey[900], 0.08)}`, sm: 'none' }),
        '@media (hover: hover)': {
          '&:hover': {
            borderColor: 'transparent',
            boxShadow: (t) => `0 12px 28px ${alpha(t.palette.grey[900], 0.08)} !important`,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', h: '100%' }}>
        <Box
          className={`${iconBg} ${gradient} w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl mb-3 flex items-center justify-center text-gray-500 shadow-md transition-transform group-hover:scale-105 mobile-icon`}
        >
          {icon}
        </Box>
        <Typography
          variant="h6"
          className="font-bold text-gray-500 mb-0.5"
          sx={{ fontSize: { xs: '0.82rem', sm: '1rem' }, lineHeight: 1.3 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          className="text-gray-500 line-clamp-2"
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
          className='text-gray-500 uppercase'
          sx={{ color: 'text.secondary', letterSpacing: 1.2, fontWeight: 600, fontSize: '0.65rem' }}
        >
          {subtitle}
        </Typography>
        <Typography className='text-gray-500' variant="h5" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '1.15rem', sm: '1.35rem' } }}>
          {title}
        </Typography>
      </Box>
      {aside}
    </Box>
  );
}

export default function DashboardDefault() {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [showBalance, setShowBalance] = useState(true);
  const [comptes, setComptes] = useState<Compte[]>([]);

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
        const cps = await getComptes();
        if (cancelled) return;
        setComptes(Array.isArray(cps) ? cps : []);
      } catch (error) {
        console.error("Erreur chargement comptes", error);
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

  const budgetRestant = Math.max(0, totalSolde - lastMonthTotal);

  const navigationCards = useMemo(
    () => [
      {
        icon: <CategoryOutlinedIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Nature de la dépense',
        description: 'Catégories et libellés',
        gradient: 'bg-premium-indigo',
        iconBg: 'bg-white/20',
        to: '/categorie',
      },
      {
        icon: <SavingsOutlinedIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Budgets',
        description: 'Budgets suivis',
        gradient: 'bg-premium-emerald',
        iconBg: 'bg-white/20',
        to: '/budget',
      },
      {
        icon: <SavingsOutlinedIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Transactions',
        description: 'Historique des flux',
        gradient: 'bg-premium-blue',
        iconBg: 'bg-white/20',
        to: '/transaction',
      },
      {
        icon: <FlagOutlinedIcon sx={{ fontSize: 'inherit' }} />,
        title: 'Objectifs',
        description: 'Objectifs financiers',
        gradient: 'bg-premium-amber',
        iconBg: 'bg-white/20',
        to: '/objectif',
      },
      {
        icon: <MonetizationOnOutlinedIcon sx={{ fontSize: 'inherit' }} />,
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

  // Render du tableau de bord

  return (
    <Container
      component="main"
      maxWidth="sm"

      sx={{
        minHeight: '100vh',
        bgcolor: 'grey.50',
        pt: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        pb: { xs: 'max(24px, env(safe-area-inset-bottom))', sm: 6 },
      }}
    >
      <Stack spacing={3}>

        {/* ═══════════════════════════════════════
               HERO CARD — Solde + Période
          ═══════════════════════════════════════ */}
        <Box
          sx={{
            borderRadius: 6,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f2744 100%)',
            p: { xs: '28px 24px 24px', sm: '36px 32px 28px' },
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.45)',
          }}
        >
          {/* Orbes décoratifs */}
          <Box sx={{
            position: 'absolute', top: -60, right: -40,
            width: 200, height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', bottom: -40, left: -20,
            width: 150, height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Label */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceWalletIcon sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                Solde total
              </Typography>
            </Box>
            <Box
              component="button"
              onClick={() => setShowBalance((prev) => !prev)}
              sx={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '50%',
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.7)',
                transition: 'background 0.2s',
                '&:hover': { background: 'rgba(255,255,255,0.15)' },
              }}
            >
              {showBalance
                ? <VisibilityIcon sx={{ fontSize: 16 }} />
                : <VisibilityOffIcon sx={{ fontSize: 16 }} />}
            </Box>
          </Box>

          {/* Montant */}
          <Typography
            sx={{
              fontSize: { xs: '2rem', sm: '2.6rem' },
              fontWeight: 800,
              color: 'white',
              letterSpacing: -0.5,
              lineHeight: 1.1,
              mb: 0.5,
              fontVariantNumeric: 'tabular-nums',
              transition: 'opacity 0.2s',
            }}
          >
            {showBalance ? totalSolde.toLocaleString('fr-FR') : '••••••'}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 600, mb: 3, letterSpacing: 0.5 }}>
            FCFA
          </Typography>

          </Box>

        {/* ═══════════════════════════════════════
               2 CARTES BUDGET / DÉPENSES
          ═══════════════════════════════════════ */}
        <Grid container spacing={2}>
          {/* Budget restant */}
          <Grid item xs={6}>
            {(() => {
              const pct = totalSolde > 0 ? Math.min(100, Math.round((budgetRestant / totalSolde) * 100)) : 0;
              const color = pct >= 50 ? '#10B981' : pct >= 25 ? '#F59E0B' : '#EF4444';
              const radius = 28;
              const circ = 2 * Math.PI * radius;
              return (
                <Paper elevation={0} sx={{
                  p: 2.5, borderRadius: 5,
                  bgcolor: 'white',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  display: 'flex', flexDirection: 'column', gap: 1.5,
                  minHeight: 160,
                }}>
                  {/* Icône */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: 2,
                      background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 16, color: '#059669' }} />
                    </Box>
                    <Typography className='text-gray-500' sx={{ fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.2 }}>
                      Budget<br />restant
                    </Typography>
                  </Box>
                  {/* Valeur + anneau */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography className='text-gray-500' sx={{ fontSize: '1.1rem', fontWeight: 800, color, lineHeight: 1.1 }}>
                        {budgetRestant.toLocaleString('fr-FR')}
                      </Typography>
                      <Typography className='text-gray-500' sx={{ fontSize: '0.6rem', color: 'text.disabled', fontWeight: 600 }}>FCFA</Typography>
                    </Box>
                    {/* SVG ring */}
                    <Box component="svg" width={64} height={64} viewBox="0 0 68 68" sx={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={34} cy={34} r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={6} />
                      <circle cx={34} cy={34} r={radius} fill="none" stroke={color} strokeWidth={6}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - pct / 100)}
                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                      />
                    </Box>
                  </Box>
                  <Typography className='text-gray-500' sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>{pct}% disponible</Typography>
                </Paper>
              );
            })()}
          </Grid>

          {/* Dépenses du mois */}
          <Grid item xs={6}>
            {(() => {
              const pct = totalSolde > 0 ? Math.min(100, Math.round((currentMonthExpenseTotal / totalSolde) * 100)) : 0;
              const color = pct <= 30 ? '#10B981' : pct <= 60 ? '#F59E0B' : '#EF4444';
              const radius = 28;
              const circ = 2 * Math.PI * radius;
              return (
                <Paper elevation={0} sx={{
                  p: 2.5, borderRadius: 5,
                  bgcolor: 'white',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  display: 'flex', flexDirection: 'column', gap: 1.5,
                  minHeight: 160,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: 2,
                      background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <TrendingDownIcon sx={{ fontSize: 16, color: '#DC2626' }} />
                    </Box>
                    <Typography className='text-gray-500' sx={{ fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.2 }}>
                      Dépenses<br />du mois
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography className='text-gray-500' sx={{ fontSize: '1.1rem', fontWeight: 800, color, lineHeight: 1.1 }}>
                        {currentMonthExpenseTotal.toLocaleString('fr-FR')}
                      </Typography>
                      <Typography className='text-gray-500' sx={{ fontSize: '0.6rem', color: 'text.disabled', fontWeight: 600 }}>FCFA</Typography>
                    </Box>
                    <Box component="svg" width={64} height={64} viewBox="0 0 68 68" sx={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={34} cy={34} r={radius} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={6} />
                      <circle cx={34} cy={34} r={radius} fill="none" stroke={color} strokeWidth={6}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - pct / 100)}
                        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                      />
                    </Box>
                  </Box>
                  <Typography className='text-gray-500' sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>{pct}% du solde</Typography>
                </Paper>
              );
            })()}
          </Grid>
        </Grid>

        {/* ═══════════════════════════════════════
               GRAPHIQUE + OBJECTIFS (côte à côte)
          ═══════════════════════════════════════ */}
        <Grid container spacing={2}>

          {/* Dépenses — mini area chart */}
          <Grid item xs={6}>
            <Paper elevation={0} sx={{
              borderRadius: 5,
              border: '1px solid rgba(0,0,0,0.06)',
              bgcolor: 'white',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              height: '100%',
            }}>
              {/* Header colonne */}
              <Box sx={{
                px: 1.5, pt: 1.5, pb: 1,
                display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}>
                <Box sx={{
                  width: 28, height: 28, borderRadius: 2, flexShrink: 0,
                  background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BarChartIcon sx={{ fontSize: 15, color: '#7c3aed' }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography className='text-gray-500' sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.primary', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Dépenses
                  </Typography>
                  <Typography className='text-gray-500' sx={{ fontSize: '0.58rem', color: 'text.disabled', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Évolution</Typography>
                </Box>
              </Box>
              <MiniExpenseChart />
            </Paper>
          </Grid>

          {/* Objectifs financiers */}
          <Grid item xs={6}>
            <Paper elevation={0} sx={{
              borderRadius: 5,
              border: '1px solid rgba(0,0,0,0.06)',
              bgcolor: 'white',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              height: '100%',
            }}>
              {/* Header colonne */}
              <Box sx={{
                px: 1.5, pt: 1.5, pb: 1,
                display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}>
                <Box sx={{
                  width: 28, height: 28, borderRadius: 2, flexShrink: 0,
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TrackChangesIcon sx={{ fontSize: 15, color: '#d97706' }} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography className='text-gray-500' sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.primary', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Objectifs
                  </Typography>
                  <Typography className='text-gray-500' sx={{ fontSize: '0.58rem', color: 'text.disabled', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Suivi des cibles</Typography>
                </Box>
              </Box>
              <MonthlyTarget />
            </Paper>
          </Grid>

        </Grid>

        {/* Actions rapides */}
        <Box sx={{ pb: { xs: 2, sm: 0 } }}>
          <SectionHeader title="Raccourcis" subtitle="Navigation" />
          <Grid container spacing={2}>
            {navigationCards.map((card) => (
              <Grid item xs={6} sm={4} key={card.to}>
                <NavigationCard {...card} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}

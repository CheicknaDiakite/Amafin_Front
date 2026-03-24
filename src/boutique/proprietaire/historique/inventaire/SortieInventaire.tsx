import { Alert, Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useStoreUuid } from '../../../../usePerso/store';
import { useFetchUser, useStockEntreprise } from '../../../../usePerso/fonction.user';
import { formatNumberWithSpaces } from '../../../../usePerso/fonctionPerso';
import { connect } from '../../../../_services/account.service';
import AnalyticEcommerce from '../../../../components/cards/statistics/AnalyticEcommerce';
import { format } from 'date-fns';
import Nav from '../../../../_components/Button/Nav';

// Types

// Loading component
const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <CircularProgress />
  </Box>
);

// Error component
const ErrorMessage = () => (
  <Stack sx={{ width: '100%', padding: 2 }} spacing={2}>        
    <Alert severity="error">Une erreur est survenue lors de la récupération des données. Veuillez réessayer.</Alert>
  </Stack>
);

export default function SortieInventaire() {
    const uuid = useStoreUuid((state) => state.selectedId);
    const { unUser } = useFetchUser(connect);
    
  const { stockEntreprise, isLoading, isError } = useStockEntreprise(uuid || '');
    
    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage />;
    if (!stockEntreprise) return null;

    // const hasSales = stockEntreprise.details_entrer_par_mois && stockEntreprise?.details_entrer_par_mois.length > 0;
    const hasSales = stockEntreprise.details_sortie_par_mois as unknown as Record<string, { somme_qte: number; somme_prix_total: string; }>;
    
    return (
      <>
        <Nav />
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          <Grid item xs={12} sx={{ mb: -2.25 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Statistiques des ventes mensuelles
            </Typography>
          </Grid>
    
          {!hasSales ? (
            <Grid item xs={12}>
              <Typography variant="h6" color="text.secondary" align="center">
                Aucune vente n'a été enregistrée pour le moment.
              </Typography>
            </Grid>
          ) : (
            Object.entries(stockEntreprise.details_sortie_par_mois ?? {}).map(([month, details], index) => {
              const saleDate = new Date(month);
              return (
                <Grid item key={`${month}-${index}`} xs={12} sm={6} md={4} lg={3}>
                  <AnalyticEcommerce
                    title="Ventes mensuelles"
                    count={(details as any).somme_qte || 0}
                    // pied="Détails des ventes pour le mois de"
                    pied={`${formatNumberWithSpaces((details as any).somme_prix_total || 0)} f au mois de`}
                    extra={format(saleDate, 'MMMM yyyy')}
                    className="bg-blue-100"
                    user={unUser.role}
                  />
                </Grid>
              );
            })
          )}
        </Grid>
      </>
    );
}

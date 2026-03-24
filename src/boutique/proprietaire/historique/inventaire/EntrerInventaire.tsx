import { Alert, Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { useStoreUuid } from '../../../../usePerso/store';
import { useFetchEntreprise, useFetchUser, useStockEntreprise } from '../../../../usePerso/fonction.user';
import { connect } from '../../../../_services/account.service';
import AnalyticEcommerce from '../../../../components/cards/statistics/AnalyticEcommerce';
import { format } from 'date-fns';
import Nav from '../../../../_components/Button/Nav';

// Types
interface MonthlyPurchase {
  month: string;
  count: number;
}

// Components
const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
    <CircularProgress />
  </Box>
);

const ErrorMessage = () => (
  <Stack sx={{ width: '100%', padding: 2 }} spacing={2}>        
    <Alert severity="error">Une erreur est survenue lors de la récupération des données. Veuillez réessayer.</Alert>
  </Stack>
);

const MonthlyPurchaseCard = ({ data, userRole }: { data: MonthlyPurchase, userRole: number }) => {
  const purchaseDate = new Date(data.month);
  
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <AnalyticEcommerce
        title="Achats mensuels"
        count={data.count}
        pied="Détails des achats pour le mois de"
        extra={format(purchaseDate, 'MMMM yyyy')}
        className="bg-blue-100"
        user={userRole}
      />
    </Grid>
  );
};

export default function EntrerInventaire() {
  const uuid = useStoreUuid((state) => state.selectedId);
  const { unUser } = useFetchUser(connect);
  const { unEntreprise } = useFetchEntreprise(uuid);
  const { stockEntreprise, isLoading, isError } = useStockEntreprise(unEntreprise?.uuid || '');

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage />;
  if (!stockEntreprise) return null;

  const hasPurchases = stockEntreprise.count_entrer_par_mois && stockEntreprise.count_entrer_par_mois.length > 0;
  console.log("yy ..", stockEntreprise)
  return (
    <>
      <Nav />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" component="h1" gutterBottom>
            Statistiques des achats mensuels
          </Typography>
        </Grid>

        <Grid item xs={12}>
          {!hasPurchases ? (
            <Typography variant="h6" color="text.secondary" align="center">
              Aucun achat n'a été enregistré pour le moment.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {stockEntreprise.count_entrer_par_mois?.map((purchase: MonthlyPurchase, index: number) => (
                <MonthlyPurchaseCard
                  key={`${purchase.month}-${index}`}
                  data={purchase}
                  userRole={unUser.role}
                />
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
}

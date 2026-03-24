import { useFetchEntreprise, useStockSemaine } from '../../../usePerso/fonction.user'
import { useStoreUuid } from '../../../usePerso/store'
import { Grid, Typography } from '@mui/material'
import Nav from '../../../_components/Button/Nav'
import { format } from 'date-fns'
import Chart_2 from '../../../_components/Chart/Chart_2'

export default function EtaVente() {
    
  const uuid = useStoreUuid((state) => state.selectedId)
  const {unEntreprise} = useFetchEntreprise(uuid)
  const {stockSemaine} = useStockSemaine(unEntreprise.uuid!)

  return (<>
      <Nav />
    
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        {/* Titre */}
        <Grid item xs={12} sx={{ mb: -2.25 }}>
          <Typography variant="h5">Le nombre de ventes effectuées par mois</Typography>
        </Grid>
  
        {/* Vérification des données */}
        {/* {Object.keys(sortiesParMois).length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h5">Il n'y a pas eu de ventes ce mois-ci !</Typography>
          </Grid>
        ) : (
          Object.entries(sortiesParMois).map(([date, sorties], index) => {
            // const totalPrix = sorties?.length; // Calcul du total pour la date
            const validDate = new Date(date);
            // console.log("test", sorties.length)
            
            return (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce
                  title=" "
                  count={totalPrix} // Total des ventes pour la date
                  pied={`Détails des sorties pour le mois de`}
                  extra={format(validDate, 'MMMM yyyy')} // Format: Mois et Année
                  className="bg-blue-100"
                />
              </Grid>
            );
          })
        )} */}

        {(!stockSemaine.sorties_par_mois || stockSemaine.sorties_par_mois.length === 0) ? (
            <Grid item xs={12} sx={{ mb: -2.25 }}>
            <Typography variant="h5">Il n'y a pas eu de vente !</Typography>
            </Grid>
            ) : (
            stockSemaine.sorties_par_mois.map((post, index) => {
            // const validDate = post.week ? new Date(post.month) : new Date(); // Vérifie si `post.week` est valide
            const validD = new Date(post.month) // Vérifie si `post.week` est valide
            
            return (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                {/* <Link to="/sortie"> */}
                <Typography variant="h5">Eta de vente {format(validD, 'MMMM yyyy')}</Typography>
                <Chart_2 details={post.details} />
                {/* </Link> */}
                </Grid>
            );
            })
        )}

        {/* <ul>
          {stockEntreprise.details_sortie_par_mois && 
            Object.entries(stockEntreprise.details_sortie_par_mois).map(([mois, details]) => {
              console.log("test ..",details)
              return <li key={mois}>
                <h3>Détails pour {mois}</h3>
                <ul>
                  {details?.map((detail) => (
                    <li key={detail.id}>
                      <p>Quantité : {detail.qte}</p>
                      <p>Prix unitaire : {detail.pu}</p>
                      <p>Prix total : {detail.prix_total}</p>
                      <p>Date : {new Date(detail.created_at).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              </li>
            })}
        </ul> */}

      
  
        {/* Ajout d'espace (si nécessaire) */}
        <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />
      </Grid>
    </>)
}

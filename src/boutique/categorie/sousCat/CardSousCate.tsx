import { Button, Grid } from '@mui/material'
import EditIcon from '@mui/icons-material/BorderColor';
import AnalyticEcommerce from '../../../components/cards/statistics/AnalyticEcommerce'
import { Link } from 'react-router-dom'
import { FC } from 'react';
import { CardSousCateProps } from './SousCat';
import { useFetchUser } from '../../../usePerso/fonction.user';
import { connect } from '../../../_services/account.service';

export const CardSousCate: FC<CardSousCateProps> = ({ post }) => {
  const {unUser} = useFetchUser(connect)
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      {/* <Link to={`/categorie/info/${post.uuid}`}>
        <AnalyticEcommerce title={post.libelle} pied={"categorie"} />
      </Link> */}
      {unUser.role === 1 ?      
      <Link to={`/categorie/info/${post.uuid}`}>
        <AnalyticEcommerce title={post.libelle} pied={"categorie"} />
      </Link>
      : 
      <AnalyticEcommerce title={post.libelle} pied={"categorie"} />
      }
      <div className="flex space-x-2 mt-2 items-center justify-center">
        <Link to={`/categorie/sous/modif/${post.uuid}`}>
          <Button size="small" className="rounded-full shadow-md shadow-indigo-500/50">
            <EditIcon color="primary" fontSize="small" />
          </Button>
        </Link>
      </div>
    </Grid>
  );
};


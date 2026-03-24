import { Route, Routes } from 'react-router-dom'
import Dashboard from '../../layout/Dashboard'
import DashboardDefault from '../../pages/dashboard'
import ComponentShadow from '../../pages/component-overview/shadows'
import ModifCate from '../../boutique/categorie/ModifCate'
import ModifSousCate from '../../boutique/categorie/sousCat/ModifSousCate'
import Info from '../../boutique/categorie/sousCat/info/Info'
import Admin from '../../boutique/proprietaire/Admin/Admin'
import SousCat from '../../boutique/categorie/sousCat/SousCat'
import ProtectedRoute from '../ProtectedRoute'
import Users from '../../boutique/proprietaire/users/Users'
import { UserModif } from '../../boutique/proprietaire/users/UserModif'
import Depense from '../../boutique/proprietaire/Produit/Depense'
import DepenseModif from '../../boutique/proprietaire/Produit/DepenseModif'
import Personnel from '../../boutique/proprietaire/Personnel/Personnel'
import { PersonnelModif } from '../../boutique/proprietaire/Personnel/PersonnelModif'
import Avis from '../../boutique/proprietaire/users/Avis'
import MesInscrit from '../../boutique/proprietaire/users/MesInscrit'
import backgroundImage from '../../../public/icon-192x192.png'
import { Box } from '@mui/material'
import { useStoreUuid } from '../../usePerso/store'
import { useFetchEntreprise } from '../../usePerso/fonction.user'
import { BASE } from '../../_services/caller.service'
import Budget from '../../boutique/proprietaire/Produit/Budget'
import Transac from '../../components/Transac'
import Objectifs from '../../components/Objectifs'


export default function PublicRouter() {
  // notClick()

  const uuid = useStoreUuid((state) => state.selectedId);
  const { unEntreprise } = useFetchEntreprise(uuid);
  const url = unEntreprise.image ? BASE(unEntreprise.image) : backgroundImage;
  
  return (
    <Box 
      className='bg-red-200'
      sx={{
        background: `linear-gradient(rgba(128, 128, 128, 0.7), rgba(128, 128, 128, 0.7)), url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: { xs: '16px', sm: '24px', md: '32px' }
      }}
    >
      <Routes>
        <Route element={<Dashboard />}>
        <Route index element={ <DashboardDefault />} />
          {/* <Route index element={ <DashboardDefault />} /> */}          

          <Route path='depense'>
            <Route index element={<Depense />} />
            <Route path=':uuid' element={<DepenseModif />} />
          </Route>

          <Route path='budget'>
            <Route index element={<Budget />} />
          </Route>

          <Route path='transaction'>
            <Route index element={<Transac />} />
          </Route>

          <Route path='objectif'>
            <Route index element={<Objectifs />} />
          </Route>

          <Route path='personnel' >

            {/* <Route element={<ProtectedRoute requiredRole={1} redirectPath="/" />}> */}
              <Route index element={<Personnel />} />
              <Route path='modif/:uuid' element={<PersonnelModif />} />
            {/* </Route>       */}

          </Route>

          <Route path='utilisateur'>
            <Route element={<ProtectedRoute requiredRole={1} redirectPath="/" />}>
              <Route path="admin" element={<Users />} />
              <Route path='admin/modif/:uuid' element={<UserModif />} />
            </Route>

            <Route path='modif/:uuid' element={<Admin />} />
          </Route>
          {/* </Route> */}
          
          {/* <Route element={<ProtectedRoute requiredRole={[1, 2]} redirectPath="/" />}>         */}
            <Route path='categorie' >
              <Route index element={<ComponentShadow />} />
              
              <Route path='modif/:uuid' element={<ModifCate />} /> 

              <Route path='sous'>
                <Route path=':uuid'  element={<SousCat />} />
                <Route path='modif/:uuid'  element={<ModifSousCate />} />
              </Route>

              <Route path='info/:uuid'  element={<Info />} />
                      
            </Route>
          {/* </Route> */}

          <Route path='user'>

            <Route element={<ProtectedRoute requiredRole={1} redirectPath="/" />}>
              <Route path="admin" element={<Users />} />            
              <Route path="avis" element={<Avis />} />
              
            </Route>

            <Route path="mesInscrit" element={<MesInscrit />} />
            <Route path='admin/modif/:uuid' element={<UserModif />} />

            <Route path='modif/:id' element={<Admin />} />
          </Route>

        </Route>
      </Routes>
    </Box>
  )
}

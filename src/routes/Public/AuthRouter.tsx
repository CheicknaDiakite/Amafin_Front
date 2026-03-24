import { Route, Routes } from 'react-router-dom'
import MinimalLayout from '../../layout/MinimalLayout'
import AuthLogin from '../../pages/authentication/login'
import AuthRegister from '../../pages/authentication/register'
import Mdp from '../../pages/authentication/Mdp'
import { notClick } from '../../usePerso/fonctionPerso'
import SignIn from '../../pages/authentication/SignIn'

export default function AuthRouter() {
  // notClick()
  return (
    <Routes>
      <Route element= {<MinimalLayout />}>
        <Route path='login' element={<AuthLogin />} />
        <Route path='mot_de_passe_oublier' element={<Mdp />} />
        <Route path='register' element={<AuthRegister />} />
      </Route>
    </Routes>
  )
}

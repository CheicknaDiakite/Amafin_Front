import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicRouter from './Public/PublicRouter'
import AuthRouter from './Public/AuthRouter'
import AuthGuard from '../_helpers/AuthGuard'
import MdpUpdate from '../pages/authentication/MdpUpdate'

export default function AppRouter() {
  return (
    <>
    <BrowserRouter>
        <Routes>
          <Route path="/*" element={
            <AuthGuard>
              <PublicRouter />
            </AuthGuard>
            } />
          <Route path="/admin" element={
            <AuthGuard>
              <PublicRouter />
            </AuthGuard>
            } />
          <Route path='/auth/*' element={<AuthRouter />}/>
          <Route path='/utilisateur/update-password/:slug/:uid' element={<MdpUpdate />}/>
        </Routes>
    </BrowserRouter>
    </>
  )
}

import { Route, Routes } from 'react-router-dom'
import Dashboard from '../../layout/Dashboard'
import DashboardDefault from '../../pages/dashboard'
import Client from '../../boutique/proprietaire/client/Client'

export default function AdminRouter() {
  return (
    <Routes>
      <Route element={<Dashboard />}>
        <Route index element={ <DashboardDefault />} />

        <Route path='client' >
          <Route index element={<Client />} />
          {/* <Route path='list' element={<SortieTransfer />} /> */}
          {/* <Route path='modif/:slug' element={<ModifSortie />} /> */}
        </Route>

      </Route>
    </Routes>
  )
}

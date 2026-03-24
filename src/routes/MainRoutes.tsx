import { lazy } from 'react';

// project import
import Loadable from '../components/Loadable';
import Dashboard from '../layout/Dashboard';
const Color = Loadable(lazy(() => import('../pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('../pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('../pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('../pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element:  <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: (<Color />)
    },
    {
      path: 'inventaire',
      element: <SamplePage />
    },
    {
      path: 'entre',
      element: <Shadow />
    },
    {
      path: 'sortie',
      element: <Typography />
    },
    {
      path: 'test',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
  ]
};

export default MainRoutes;

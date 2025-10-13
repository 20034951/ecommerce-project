import { lazy } from 'react';

const RolesPage = lazy(() => import('./pages/RolesPage.jsx'));
const CreateRolePage = lazy(() => import('./pages/CreateRolePage.jsx'));
const RoleDetailPage = lazy(() => import('./pages/RoleDetailPage.jsx'));

export const rolesRoutes = [
  {
    path: '/roles',
    element: <RolesPage />,
  },
  {
    path: '/roles/create',
    element: <CreateRolePage />,
  },
  {
    path: '/roles/:id',
    element: <RoleDetailPage />,
  },
  {
    path: '/roles/:id/edit',
    element: <CreateRolePage />, // Reutilizamos el mismo componente para editar
  }
];
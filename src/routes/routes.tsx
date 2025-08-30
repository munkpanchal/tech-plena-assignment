import { createBrowserRouter } from 'react-router';

import ProtectedLayout from '../layout/ProtectedLayout';
import PublicLayout from '../layout/PublicLayout';
import NotFoundPage from '../pages/NotFound';
import DashboardPage from '../pages/protected/DashboardPage';
import Homepage from '../pages/public/Homepage';

const router = createBrowserRouter([
    {
        element: <PublicLayout />,
        children: [
            {
                path: '/',
                children: [{ path: '', element: <Homepage /> }],
            },
        ],
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                path: '/dashboard/',
                children: [{ path: '', element: <DashboardPage /> }],
            },
        ],
    },
    { path: '*', element: <NotFoundPage /> },
]);

export default router;

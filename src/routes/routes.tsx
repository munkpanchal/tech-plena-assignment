import { createBrowserRouter } from 'react-router';

import PublicLayout from '../layout/PublicLayout';
import NotFoundPage from '../pages/NotFound';
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

    { path: '*', element: <NotFoundPage /> },
]);

export default router;

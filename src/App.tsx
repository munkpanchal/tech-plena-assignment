import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router';

import router from './routes/routes';

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <Toaster
                position="top-center"
                gutter={12}
                containerStyle={{ margin: '8px' }}
                toastOptions={{
                    success: { duration: 2000 },
                    error: { duration: 2000 },
                    style: {
                        fontSize: '16px',
                        maxWidth: '500px',
                        padding: '8px 16px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-secondary)',
                    },
                }}
            />
        </>
    );
}

export default App;

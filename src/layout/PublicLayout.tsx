import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

const PublicLayout: React.FC = () => {
    const token = false;
    const location = useLocation();

    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            {isTransitioning && <h2>Loading...</h2>}
            <Outlet />
        </>
    );
};

export default PublicLayout;

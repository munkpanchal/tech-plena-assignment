import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const ProtectedLayout: React.FC = () => {
    const token = false;
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    if (!token) {
        return <Navigate to='/' replace />;
    }

    return (
        <>
            {isTransitioning && <h2>Loading...</h2>}
            <Outlet />
        </>
    );
};

export default ProtectedLayout;

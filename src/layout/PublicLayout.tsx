import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';

const PublicLayout: React.FC = () => {
    const location = useLocation();

    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (isTransitioning) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default PublicLayout;

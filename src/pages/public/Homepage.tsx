import Header from '../../components/Header';
import Holdings from '../../components/Holdings';
import Watchlist from '../../components/Watchlist';

const Homepage = () => {
    return (
        <main className="p-3 flex flex-col gap-3">
            <Header />
            <div className="p-4 flex flex-col gap-3">
                <Holdings />
                <Watchlist />
            </div>
        </main>
    );
};

export default Homepage;

import { useState, useCallback, useMemo } from 'react';
import { MdAdd, MdStar } from 'react-icons/md';
import { TbRefresh } from 'react-icons/tb';
import { useDispatch } from 'react-redux';

import { addToWatchlist } from '../store/portfolioSlice';

import CoinSelectPopup from './CoinSelectPopup';
import Button from './shared/Button';
import WatchListTable from './WatchListTable';

const Watchlist = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const dispatch = useDispatch();

    // Constants moved outside to prevent recreation
    const itemsPerPage = 10;
    const totalItems = 100; // Mock total for pagination

    // Use useCallback to prevent function recreation on every render
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    }, []);

    const handleAddToWatchlist = useCallback(() => {
        setShowPopup(true);
    }, []);

    const handleClosePopup = useCallback(
        (selectedCoins: import('../types').TokenType[] = []) => {
            if (selectedCoins && Array.isArray(selectedCoins)) {
                selectedCoins.forEach((coin) => {
                    dispatch(addToWatchlist(coin));
                });
            }
            setShowPopup(false);
        },
        [dispatch]
    );

    // Use useMemo to prevent unnecessary recalculations
    const paginationData = useMemo(() => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);

        return { totalPages, startItem, endItem };
    }, [currentPage, totalItems, itemsPerPage]);

    const { totalPages, startItem, endItem } = paginationData;

    return (
        <>
            <section className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <h2 className="primary-heading flex items-center gap-2">
                        <MdStar className="text-primary text-2xl" />
                        Watchlist
                    </h2>
                    <div className="flex gap-4">
                        <Button
                            variant="secondary"
                            icon={
                                <TbRefresh
                                    className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`}
                                />
                            }
                            onClick={handleRefresh}
                            className={
                                isRefreshing
                                    ? 'opacity-70 cursor-not-allowed'
                                    : ''
                            }
                        >
                            {isRefreshing ? 'Refreshing...' : 'Refresh Prices'}
                        </Button>
                        <Button
                            variant="primary"
                            icon={<MdAdd className="text-lg" />}
                            onClick={handleAddToWatchlist}
                        >
                            Add Token
                        </Button>
                    </div>
                </div>

                {/* Watchlist Table */}
                <WatchListTable />

                {/* Pagination */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400">
                        {startItem} — {endItem} of {totalItems} results
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-400">
                            {currentPage} of {totalPages} pages
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(1, prev - 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className={
                                    currentPage === 1
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }
                            >
                                Prev
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(totalPages, prev + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className={
                                    currentPage === totalPages
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <CoinSelectPopup open={showPopup} onClose={handleClosePopup} />
        </>
    );
};

export default Watchlist;

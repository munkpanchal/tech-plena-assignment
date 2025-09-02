import React, { useEffect, useState, useRef } from 'react';

import { fetchTrendingCoins, fetchSearchCoins } from '../services/coinApis';
import { TokenType } from '../types';

import Button from './shared/Button';

interface CoinSelectPopupProps {
    open: boolean;
    onClose: (selected: TokenType[]) => void;
}

const CoinSelectPopup: React.FC<CoinSelectPopupProps> = ({ open, onClose }) => {
    const [coins, setCoins] = useState<TokenType[]>([]);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const fetchTrendingCoinsData = async () => {
        try {
            const data = await fetchTrendingCoins();

            const coinsData = data.coins.map((coin: { item: TokenType }) => ({
                id: coin.item.id,
                name: coin.item.name,
                symbol: coin.item.symbol,
                data: {
                    price: coin.item.data?.price ?? 0,
                    price_change_percentage_24h:
                        coin.item.data?.price_change_percentage_24h?.usd ?? 0,
                    sparkline: coin.item.data?.sparkline ?? [],
                },
                price_change_percentage_24h:
                    coin.item.data?.price_change_percentage_24h?.usd ?? 0,

                image: coin.item.thumb,
                trending: true,
            }));

            setCoins(coinsData);
        } catch {
            setCoins([]);
        }
    };

    const fetchSearchResults = async (query: string) => {
        if (!query.trim()) {
            await fetchTrendingCoinsData();
            return;
        }

        try {
            setIsSearching(true);
            const data = await fetchSearchCoins(query);

            const searchResults = (data.coins || []).map(
                (coin: {
                    id: string;
                    name: string;
                    symbol: string;
                    large?: string;
                    thumb?: string;
                }) => ({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    data: {
                        price: 0, // Search API doesn't include price data
                        price_change_percentage_24h: 0,
                        sparkline: [],
                    },
                    price_change_percentage_24h: 0,
                    image: coin.large || coin.thumb || '',
                    trending: false,
                })
            );

            setCoins(searchResults);
        } catch {
            // Silently handle errors and show empty results
            setCoins([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSearchResults(search);
        }, 300); // 300ms delay to avoid too many API calls

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    useEffect(() => {
        fetchTrendingCoinsData();
    }, []);

    // Click outside detection
    const popupRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                onClose([]);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-[#212124D9] bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={popupRef}
                className="bg-base rounded-xl shadow-lg w-[min(640px,100%)] border border-white/10 relative"
            >
                <div className="p-4 py-2">
                    <input
                        type="text"
                        placeholder="Search tokens (e.g., ETH, SOL)..."
                        className="popup-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {isSearching && (
                        <div className="text-sm text-blue-400 mt-2">
                            Searching...
                        </div>
                    )}
                </div>
                <hr className="text-white/10" />
                <div className="flex flex-col gap-4 p-4">
                    <div className="mb-2 text-sm text-gray-400">
                        {search.trim()
                            ? `Search Results (${coins.length})`
                            : 'Trending'}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {coins.length > 0 ? (
                            coins.map((coin) => {
                                const isSelected = selected.includes(coin.id);
                                return (
                                    <div
                                        key={coin.id}
                                        className={`flex items-center justify-between p-2 rounded mb-1 ${isSelected ? 'bg-gray-700 opacity-60 cursor-not-allowed' : 'hover:bg-gray-800 cursor-pointer'}`}
                                        onClick={() => {
                                            if (!isSelected) {
                                                setSelected((prev) => [
                                                    ...prev,
                                                    coin.id,
                                                ]);
                                            }
                                        }}
                                        aria-disabled={isSelected}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={coin.image}
                                                alt={coin.name}
                                                className="w-7 h-7 rounded-full"
                                            />
                                            <span className="font-medium text-white">
                                                {coin.name} (
                                                {coin.symbol.toUpperCase()})
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {coin.trending && (
                                                <span className="text-yellow-400">
                                                    ★
                                                </span>
                                            )}
                                            {isSelected ? (
                                                <span className="text-green-400">
                                                    ✔
                                                </span>
                                            ) : (
                                                <span className="w-4 h-4 border border-gray-500 rounded-full"></span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-gray-400 py-8">
                                {search.trim()
                                    ? 'No tokens found matching your search.'
                                    : 'No trending tokens available.'}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                const selectedCoins = coins.filter((coin) =>
                                    selected.includes(coin.id)
                                );
                                // Save to localStorage
                                localStorage.setItem(
                                    'watchlist',
                                    JSON.stringify(selectedCoins)
                                );
                                onClose(selectedCoins);
                            }}
                            disabled={selected.length === 0}
                        >
                            Add to Wishlist
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoinSelectPopup;

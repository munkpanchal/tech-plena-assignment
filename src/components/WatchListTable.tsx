import { useMemo, memo, useCallback, useState, useRef, useEffect } from 'react';
import { MdMoreVert } from 'react-icons/md';

import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { updateHolding } from '../store/portfolioSlice';
import { TokenType } from '../types';

import type { RootState } from '../store';

const WatchListTable = memo(() => {
    const dispatch = useAppDispatch();
    const watchlist = useAppSelector(
        (state: RootState) => state.portfolio.watchlist
    );
    const [activePopover, setActivePopover] = useState<string | null>(null);
    const [editingHolding, setEditingHolding] = useState<TokenType | null>(
        null
    );
    const [editForm, setEditForm] = useState({ amount: '', price: '' });
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [inlineEditValue, setInlineEditValue] = useState('');
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setActivePopover(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Formatters
    const formatPrice = useMemo(
        () => (price: number) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: price >= 1 ? 2 : 4,
                maximumFractionDigits: price >= 1 ? 2 : 6,
            }).format(price);
        },
        []
    );

    const formatHoldings = useMemo(
        () => (holdings: number) => {
            return holdings >= 1 ? holdings.toFixed(4) : holdings.toFixed(6);
        },
        []
    );

    const handleEditHolding = useCallback((item: TokenType) => {
        setEditingHolding(item);
        setEditingRowId(item.id);
        setInlineEditValue((item.holdings || 0).toString());
        setEditForm({
            amount: (item.holdings || 0).toString(),
            price: (item.data?.price || 0).toString(),
        });
        setActivePopover(null);
    }, []);

    const handleInlineSave = useCallback(
        (item: TokenType) => {
            if (inlineEditValue && !isNaN(parseFloat(inlineEditValue))) {
                const newHoldings = parseFloat(inlineEditValue);
                const currentPrice = item.data?.price || 0;

                const updates = {
                    holdings: newHoldings,
                    value: newHoldings * currentPrice,
                };

                dispatch(updateHolding({ id: item.id, updates }));
                setEditingRowId(null);
                setInlineEditValue('');
            }
        },
        [inlineEditValue, dispatch]
    );

    const handleInlineCancel = useCallback(() => {
        setEditingRowId(null);
        setInlineEditValue('');
    }, []);

    const handleUpdateHolding = useCallback(() => {
        if (editingHolding && editForm.amount && editForm.price) {
            const updates = {
                holdings: parseFloat(editForm.amount),
                data: {
                    ...editingHolding.data,
                    price: parseFloat(editForm.price),
                },
                value: parseFloat(editForm.amount) * parseFloat(editForm.price),
            };

            dispatch(updateHolding({ id: editingHolding.id, updates }));
            setEditingHolding(null);
            setEditForm({ amount: '', price: '' });
        }
    }, [editingHolding, editForm, dispatch]);

    const formatValue = useMemo(
        () => (value: number) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(value);
        },
        []
    );

    if (!watchlist || watchlist.length === 0) {
        return (
            <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400 border border-gray-700">
                Please add to watch list
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                                    Token
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                                    24h %
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                                    Sparkline (7d)
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                                    Holdings
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {watchlist.map((item) => {
                                // Use correct field names from localStorage/redux data
                                const price = item.data.price ?? 0;
                                const priceChange =
                                    item.data.price_change_percentage_24h
                                        ?.usd ?? 0;
                                const sparklineUrl = item.data.sparkline ?? '';
                                const holdings = item.holdings ?? 0;
                                const value = item.value ?? 0;
                                const isEditing = editingRowId === item.id;

                                return (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-800 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={`${item.name} logo`}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div>
                                                    <div className="font-medium text-white">
                                                        {item.name} (
                                                        {item.symbol})
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-medium">
                                                {formatPrice(price)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div
                                                className={`font-medium ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                                            >
                                                {priceChange >= 0 ? '+' : ''}
                                                {priceChange.toFixed(2)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {sparklineUrl ? (
                                                <img
                                                    src={sparklineUrl}
                                                    alt="sparkline"
                                                    className="w-20 h-8"
                                                />
                                            ) : (
                                                <span className="text-gray-400">
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={inlineEditValue}
                                                        onChange={(e) =>
                                                            setInlineEditValue(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-20 p-1 bg-gray-700 rounded border border-gray-600 text-white text-sm"
                                                        step="0.000001"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() =>
                                                                handleInlineSave(
                                                                    item
                                                                )
                                                            }
                                                            className="text-green-400 hover:text-green-300 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={
                                                                handleInlineCancel
                                                            }
                                                            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                                                        >
                                                            ✗
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-white font-medium">
                                                    {formatHoldings(holdings)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-white font-medium">
                                                    {isEditing ? (
                                                        <span className="text-blue-400">
                                                            $
                                                            {(
                                                                parseFloat(
                                                                    inlineEditValue ||
                                                                        '0'
                                                                ) * price
                                                            ).toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        formatValue(value)
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <button
                                                        className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                                                        onClick={() =>
                                                            setActivePopover(
                                                                activePopover ===
                                                                    item.id
                                                                    ? null
                                                                    : item.id
                                                            )
                                                        }
                                                    >
                                                        <MdMoreVert className="text-xl" />
                                                    </button>

                                                    {/* Popover */}
                                                    {activePopover ===
                                                        item.id && (
                                                        <div
                                                            ref={popoverRef}
                                                            className="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10"
                                                        >
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditHolding(
                                                                            item
                                                                        )
                                                                    }
                                                                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                                                                >
                                                                    ✏️ Edit
                                                                    Holding
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        setActivePopover(
                                                                            null
                                                                        )
                                                                    }
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-gray-700 transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Holding Modal */}
            {editingHolding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 w-96 border border-gray-700">
                        <h3 className="text-xl font-medium mb-4 text-white">
                            Edit Holding
                        </h3>
                        <div className="mb-4 p-3 bg-gray-700 rounded">
                            <div className="flex items-center gap-3">
                                <img
                                    src={editingHolding.image}
                                    alt={editingHolding.name}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div>
                                    <div className="font-medium text-white">
                                        {editingHolding.name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {editingHolding.symbol.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    step="0.000001"
                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                    value={editForm.amount}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            amount: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Price per coin
                                </label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    step="0.01"
                                    className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-white"
                                    value={editForm.price}
                                    onChange={(e) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            price: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                                onClick={() => {
                                    setEditingHolding(null);
                                    setEditForm({ amount: '', price: '' });
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleUpdateHolding}
                                disabled={!editForm.amount || !editForm.price}
                            >
                                Update Holding
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

WatchListTable.displayName = 'WatchListTable';

export default WatchListTable;

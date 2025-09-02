import { createSlice } from '@reduxjs/toolkit';

import { PortfolioState } from '../types';

// Load initial state from localStorage
const loadInitialState = (): PortfolioState => {
    try {
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        const holdings = JSON.parse(localStorage.getItem('holdings') || '{}');
        const lastUpdated = localStorage.getItem('lastUpdated') || null;

        return {
            watchlist,
            holdings,
            lastUpdated,
            isFetching: false,
            error: null,
        };
    } catch {
        return {
            watchlist: [],
            holdings: {},
            lastUpdated: null,
            isFetching: false,
            error: null,
        };
    }
};

const initialState: PortfolioState = loadInitialState();

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState,
    reducers: {
        setPortfolio: (state, action) => {
            const { watchlist, holdings } = action.payload;
            state.watchlist = watchlist;
            state.holdings = holdings;
            state.lastUpdated = new Date().toISOString();

            // Persist to localStorage
            localStorage.setItem('watchlist', JSON.stringify(watchlist));
            localStorage.setItem('holdings', JSON.stringify(holdings));
            localStorage.setItem('lastUpdated', state.lastUpdated);
        },
        addToWatchlist: (state, action) => {
            // Prevent duplicates
            if (
                !state.watchlist.some((coin) => coin.id === action.payload.id)
            ) {
                state.watchlist.push(action.payload);
                state.lastUpdated = new Date().toISOString();
                localStorage.setItem(
                    'watchlist',
                    JSON.stringify(state.watchlist)
                );
                localStorage.setItem('lastUpdated', state.lastUpdated);
            }
        },
        removeFromWatchlist: (state, action) => {
            state.watchlist = state.watchlist.filter(
                (coin) => coin.id !== action.payload.id
            );
            state.lastUpdated = new Date().toISOString();
            localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
            localStorage.setItem('lastUpdated', state.lastUpdated);
        },
        addHolding: (state, action) => {
            state.holdings[action.payload.id] = action.payload;
            state.lastUpdated = new Date().toISOString();
            localStorage.setItem('holdings', JSON.stringify(state.holdings));
            localStorage.setItem('lastUpdated', state.lastUpdated);
        },
        removeHolding: (state, action) => {
            delete state.holdings[action.payload.id];
            state.lastUpdated = new Date().toISOString();
            localStorage.setItem('holdings', JSON.stringify(state.holdings));
            localStorage.setItem('lastUpdated', state.lastUpdated);
        },
        updateHolding: (state, action) => {
            const { id, updates } = action.payload;
            if (state.holdings[id]) {
                state.holdings[id] = { ...state.holdings[id], ...updates };
                state.lastUpdated = new Date().toISOString();
                localStorage.setItem(
                    'holdings',
                    JSON.stringify(state.holdings)
                );
                localStorage.setItem('lastUpdated', state.lastUpdated);
            }
        },
        clearPortfolio: (state) => {
            state.watchlist = [];
            state.holdings = {};
            state.lastUpdated = new Date().toISOString();
            localStorage.removeItem('watchlist');
            localStorage.removeItem('holdings');
            localStorage.setItem('lastUpdated', state.lastUpdated);
        },
    },
});

export const {
    setPortfolio,
    addToWatchlist,
    removeFromWatchlist,
    addHolding,
    removeHolding,
    updateHolding,
    clearPortfolio,
} = portfolioSlice.actions;
export default portfolioSlice.reducer;

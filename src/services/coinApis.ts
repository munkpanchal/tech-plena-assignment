/* eslint-disable no-console */

export const fetchSearchCoins = async (query: string) => {
    try {
        const response = await api.get(`/search?query=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error searching coins:', error);
        throw error;
    }
};
/* eslint-disable no-console */
import api from './api';

export const fetchAllCoins = async () => {
    try {
        const response = await api.get('/coins/list');
        return response.data;
    } catch (error) {
        console.error('Error fetching all coins:', error);
        throw error;
    }
};

export const fetchTrendingCoins = async () => {
    try {
        const response = await api.get('/search/trending');
        return response.data;
    } catch (error) {
        console.error('Error fetching trending coins:', error);
        throw error;
    }
};

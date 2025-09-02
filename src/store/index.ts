import { configureStore } from '@reduxjs/toolkit';

import portfolioReducer from './portfolioSlice';

const store = configureStore({
    reducer: {
        portfolio: portfolioReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

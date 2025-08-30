import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface ThemeState {
    currentTheme: Theme;
}

const getInitialTheme = (): Theme => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    return 'light';
};

const initialState: ThemeState = {
    currentTheme: getInitialTheme(),
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
            // Update localStorage
            localStorage.setItem('theme', state.currentTheme);
            // Update document class for CSS variables
            document.documentElement.classList.toggle('dark', state.currentTheme === 'dark');
        },
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.currentTheme = action.payload;
            // Update localStorage
            localStorage.setItem('theme', state.currentTheme);
            // Update document class for CSS variables
            document.documentElement.classList.toggle('dark', state.currentTheme === 'dark');
        },
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { toggleTheme, setTheme, Theme } from '../store/themeSlice';

export const useTheme = () => {
    const dispatch = useDispatch();
    const currentTheme = useSelector(
        (state: RootState) => state.theme.currentTheme
    );

    const toggle = () => dispatch(toggleTheme());
    const set = (theme: Theme) => dispatch(setTheme(theme));

    return {
        currentTheme,
        toggle,
        set,
        isDark: currentTheme === 'dark',
        isLight: currentTheme === 'light',
    };
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import { LocalStorage } from '@helpers/localstorage';
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  FC,
  Children,
} from 'react';

type themetype = 'dark' | 'light';

type themeprops = {
  theme: themetype;
  themetoggle: () => void;
};

const THEME_KEY = '@theme';
export const ThemeContext = createContext<themeprops>({
  theme: 'light',
  themetoggle: () => {},
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<themetype>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await LocalStorage.read(THEME_KEY);

      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const themetoggle = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);

      await LocalStorage.save(THEME_KEY, newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };
  return (
    <ThemeContext.Provider value={{ theme, themetoggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

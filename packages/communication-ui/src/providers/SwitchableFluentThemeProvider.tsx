// © Microsoft Corporation. All rights reserved.

import React, { useState, useMemo, createContext, useContext } from 'react';
import { NamedTheme, ThemeCollection } from '../types';
import { defaultThemes } from '../constants';
import { FluentThemeProvider } from './FluentThemeProvider';

const defaultTheme: NamedTheme = defaultThemes.light;

/**
 * Interface for React useContext hook containing the FluentTheme and a setter to switch themes
 */
export interface SwitchableFluentThemeContext {
  /**
   * Currently chosen theme.
   * @defaultValue lightTheme
   */
  currentTheme: NamedTheme;
  /**
   * Setter for the current theme.
   * If this the doesn't already exist in the theme context this will
   * add that theme to the store.
   */
  setCurrentTheme: (namedTheme: NamedTheme) => void;
  /**
   * All stored themes within the context
   * @defaultValue defaultThemes
   */
  themeStore: ThemeCollection;
}

const LocalStorageKey_Theme = 'AzureCommunicationUI_Theme';

/**
 * Function to get theme from LocalStorage
 */
const getThemeFromLocalStorage = (scopeId: string): string | null =>
  window.localStorage.getItem(LocalStorageKey_Theme + '_' + scopeId);

/**
 * Function to save theme to LocalStorage
 */
const saveThemeToLocalStorage = (theme: string, scopeId: string): void =>
  window.localStorage.setItem(LocalStorageKey_Theme + '_' + scopeId, theme);

/**
 * React useContext for FluentTheme state of SwitchableFluentThemeProvider
 */
const SwitchableFluentThemeContext = createContext<SwitchableFluentThemeContext>({
  currentTheme: defaultTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setCurrentTheme: (theme: NamedTheme) => {},
  themeStore: { ...defaultThemes }
});

/**
 * Props for SwitchableFluentThemeProvider
 */
export interface SwitchableFluentThemeProviderProps {
  /** Children to be themed */
  children: React.ReactNode;
  /** Scope ID for context */
  scopeId: string;
  /**
   * Initial set of themes to switch between.
   * @defaultValue defaultThemes
   */
  themes?: ThemeCollection;
}

/**
 * @description Provider wrapped around FluentThemeProvider that stores themes in local storage
 * to be switched via useContext hook.
 * @param props - SwitchableFluentThemeProviderProps
 * @remarks This makes use of the browser's local storage if available
 */
export const SwitchableFluentThemeProvider = (props: SwitchableFluentThemeProviderProps): JSX.Element => {
  const { children, scopeId } = props;
  const [themeStore, setThemeCollection] = useState<ThemeCollection>(props.themes ?? defaultThemes);

  const themeFromStorage = getThemeFromLocalStorage(scopeId);
  const initialTheme = themeStore[themeFromStorage || 'light'] ?? defaultTheme;
  const [currentTheme, _setCurrentTheme] = useState<NamedTheme>(initialTheme);

  const state = useMemo<SwitchableFluentThemeContext>(
    () => ({
      currentTheme,
      setCurrentTheme: (namedTheme: NamedTheme): void => {
        _setCurrentTheme(namedTheme);

        // If this is a new theme, add to the theme store
        if (!themeStore[namedTheme.name]) {
          setThemeCollection({ ...themeStore, namedTheme });
        }

        // Save current selection to local storage. Note the theme itself
        // is not saved to local storage, only the name.
        if (typeof Storage !== 'undefined') {
          saveThemeToLocalStorage(namedTheme.name, scopeId);
        }
      },
      themeStore
    }),
    [currentTheme, scopeId, themeStore]
  );

  return (
    <SwitchableFluentThemeContext.Provider value={state}>
      <FluentThemeProvider fluentTheme={currentTheme.theme}>{children}</FluentThemeProvider>
    </SwitchableFluentThemeContext.Provider>
  );
};

/**
 * React hook for programmatically accessing the switchable fluent theme.
 */
export const useSwitchableFluentTheme = (): SwitchableFluentThemeContext => useContext(SwitchableFluentThemeContext);

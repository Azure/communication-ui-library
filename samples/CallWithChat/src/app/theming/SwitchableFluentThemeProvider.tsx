// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useMemo, createContext, useContext } from 'react';
import { FluentThemeProvider, lightTheme, darkTheme } from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import { getThemeFromLocalStorage, saveThemeToLocalStorage } from '../utils/localStorage';

/**
 * A theme with an associated name.
 */
type NamedTheme = {
  /** assigned name of theme */
  name: string;
  /** theme used for applying to components */
  theme: PartialTheme | Theme;
};

/**
 * Collection of NamedThemes
 */
type ThemeCollection = Record<string, NamedTheme>;

export const defaultThemes: ThemeCollection = {
  Light: {
    name: 'Light',
    theme: lightTheme
  },
  Dark: {
    name: 'Dark',
    theme: darkTheme
  },
  Teams: {
    name: 'Teams',
    theme: {
      palette: {
        themePrimary: '#4b53bc',
        themeLighterAlt: '#030308',
        themeLighter: '#0c0d1e',
        themeLight: '#171939',
        themeTertiary: '#2d3271',
        themeSecondary: '#4249a6',
        themeDarkAlt: '#5a61c3',
        themeDark: '#6f76cd',
        themeDarker: '#9196da',
        neutralLighterAlt: '#1e1e1e',
        neutralLighter: '#1d1d1d',
        neutralLight: '#1c1c1c',
        neutralQuaternaryAlt: '#1a1a1a',
        neutralQuaternary: '#191919',
        neutralTertiaryAlt: '#181818',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#1f1f1f'
      }
    }
  }
};

/**
 * Interface for React useContext hook containing the FluentTheme and a setter to switch themes
 */
interface SwitchableFluentThemeContext {
  /**
   * Currently chosen theme.
   * @defaultValue lightTheme
   */
  currentTheme: NamedTheme;
  /**
   * Whether to display components right-to-left
   * @defaultValue false
   */
  currentRtl: boolean;
  /**
   * Setter for the current theme.
   * If this the doesn't already exist in the theme context this will
   * add that theme to the store.
   */
  setCurrentTheme: (namedTheme: NamedTheme) => void;
  /**
   * Setter for the current rtl.
   */
  setCurrentRtl: (rtl: boolean) => void;
  /**
   * All stored themes within the context
   * @defaultValue defaultThemes
   */
  themeStore: ThemeCollection;
}

const defaultTheme: NamedTheme = defaultThemes.Light;

/**
 * React useContext for FluentTheme state of SwitchableFluentThemeProvider
 */
const SwitchableFluentThemeContext = createContext<SwitchableFluentThemeContext>({
  currentTheme: defaultTheme,
  currentRtl: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setCurrentTheme: (theme: NamedTheme) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setCurrentRtl: (rtl: boolean) => {},
  themeStore: defaultThemes
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
  const initialTheme = themeStore[themeFromStorage || defaultTheme.name] ?? defaultTheme;
  const [currentTheme, _setCurrentTheme] = useState<NamedTheme>(initialTheme);
  const [currentRtl, _setCurrentRtl] = useState<boolean>(false);

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
      currentRtl,
      setCurrentRtl: (rtl: boolean): void => {
        _setCurrentRtl(rtl);
      },
      themeStore
    }),
    [currentTheme, currentRtl, scopeId, themeStore]
  );

  return (
    <SwitchableFluentThemeContext.Provider value={state}>
      <FluentThemeProvider fluentTheme={currentTheme.theme} rtl={currentRtl}>
        {children}
      </FluentThemeProvider>
    </SwitchableFluentThemeContext.Provider>
  );
};

/**
 * React hook for programmatically accessing the switchable fluent theme.
 */
export const useSwitchableFluentTheme = (): SwitchableFluentThemeContext => useContext(SwitchableFluentThemeContext);

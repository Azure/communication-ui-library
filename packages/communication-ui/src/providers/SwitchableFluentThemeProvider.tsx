// © Microsoft Corporation. All rights reserved.

import React, { useState, useMemo, createContext, useContext } from 'react';
import { Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { THEMES, LIGHT, lightTheme, getThemeFromLocalStorage, saveThemeToLocalStorage } from '../constants/themes';
import { FluentThemeProvider } from './FluentThemeProvider';

/**
 * type for theme state of SwitchableFluentThemeProvider. Simply contains \@fluentui/react PartialTheme | Theme and an assigned name
 */
export type FluentTheme = {
  /** assigned name of theme */
  name: string;
  /** theme used for applying to all ACS UI SDK components */
  theme: PartialTheme | Theme;
};

/**
 * interface for React useContext hook containing the FluentTheme and a setter to switch themes
 */
export interface SwitchableFluentThemeContext {
  /** FluentTheme state context used for FluentThemeProvider */
  fluentTheme: FluentTheme;
  /** setter for FluentTheme */
  setFluentTheme: (fluentTheme: FluentTheme) => void;
}

const defaultTheme: FluentTheme = { name: LIGHT, theme: lightTheme };

/**
 * React useContext for FluentTheme state of SwitchableFluentThemeProvider
 */
const SwitchableFluentThemeContext = createContext<SwitchableFluentThemeContext>({
  fluentTheme: defaultTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setFluentTheme: (fluentTheme: FluentTheme) => {}
});

/**
 * Props for SwitchableFluentThemeProvider
 */
export interface SwitchableFluentThemeProviderProps {
  /** Children to be themed */
  children: React.ReactNode;
  /** Scope ID for context */
  scopeId: string;
}

/**
 * @description Provider wrapped around FluentThemeProvider that stores themes in local storage
 * to be switched via useContext hook.
 * @param props - SwitchableFluentThemeProviderProps
 */
export const SwitchableFluentThemeProvider = (props: SwitchableFluentThemeProviderProps): JSX.Element => {
  const { children, scopeId } = props;
  const themeFromStorage = getThemeFromLocalStorage(scopeId);
  const [fluentTheme, _setFluentTheme] = useState<FluentTheme>(
    themeFromStorage && THEMES[themeFromStorage]
      ? { name: themeFromStorage, theme: THEMES[themeFromStorage] }
      : defaultTheme
  );

  const themeMemo = useMemo<SwitchableFluentThemeContext>(
    () => ({
      fluentTheme: fluentTheme,
      setFluentTheme: (fluentTheme: FluentTheme): void => {
        _setFluentTheme(fluentTheme);
        if (typeof Storage !== 'undefined') {
          saveThemeToLocalStorage(fluentTheme.name, scopeId);
        }
      }
    }),
    [fluentTheme, scopeId]
  );

  return (
    <SwitchableFluentThemeContext.Provider value={themeMemo}>
      <FluentThemeProvider fluentTheme={fluentTheme.theme}>{children}</FluentThemeProvider>
    </SwitchableFluentThemeContext.Provider>
  );
};

/**
 * React hook for programmatically accessing the switchable fluent theme.
 */
export const useSwitchableFluentTheme = (): SwitchableFluentThemeContext => useContext(SwitchableFluentThemeContext);

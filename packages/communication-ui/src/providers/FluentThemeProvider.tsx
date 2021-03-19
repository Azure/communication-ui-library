// © Microsoft Corporation. All rights reserved.

import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { mergeStyles } from '@fluentui/react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';
import { THEMES, LIGHT, lightTheme, getThemeFromLocalStorage, saveThemeToLocalStorage } from '../constants/themes';

/**
 * type for theme state of FluentThemeProvider. Simply contains \@fluentui/react PartialTheme | Theme and an assigned name
 */
export type FluentTheme = {
  /** assigned name of theme */
  name: string;
  /** theme used for applying to all ACS UI SDK components */
  theme: PartialTheme | Theme;
};

/**
 * interface for React useContext hook containing the FluentTheme and a setter
 */
export interface SettableFluentThemeContext {
  /** FluentTheme state context used for FluentThemeProvider */
  fluentTheme: FluentTheme;
  /** setter for FluentTheme */
  setFluentTheme: (fluentTheme: FluentTheme) => void;
}

const defaultTheme: FluentTheme = { name: LIGHT, theme: lightTheme };

/**
 * React useContext for FluentTheme state of FluentThemeProvider
 */
const FluentThemeContext = createContext<SettableFluentThemeContext>({
  fluentTheme: defaultTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setFluentTheme: (fluentTheme: FluentTheme) => {}
});

/**
 * Props for FluentThemeProvider
 */
export interface FluentThemeProviderProps {
  /** Children to be themed */
  children: React.ReactNode;
  /** Optional theme state for FluentThemeProvider */
  theme?: FluentTheme;
}

const wrapper = mergeStyles({
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center'
});

/**
 * @description Provider to theme ACS UI SDK core components. Since ACS UI SDK core components are built with components
 * mostly from \@fluentui/react and a few from \@fluentui/react-northstar, a PartialTheme | Theme from \@fluentui/react is
 * used to align the few components from \@fluentui/react-northstar.
 * @param props - FluentThemeProviderProps
 */
export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { theme, children } = props;
  const themeFromStorage = getThemeFromLocalStorage();
  const [fluentTheme, _setFluentTheme] = useState<FluentTheme>(
    theme
      ? theme
      : themeFromStorage && THEMES[themeFromStorage]
      ? { name: themeFromStorage, theme: THEMES[themeFromStorage] }
      : defaultTheme
  );
  const [fluentNorthStarTheme, setFluentNorthStarTheme] = useState<ThemeInput<any>>(teamsTheme);

  const themeMemo = useMemo<SettableFluentThemeContext>(
    () => ({
      fluentTheme: fluentTheme,
      setFluentTheme: (fluentTheme: FluentTheme): void => {
        _setFluentTheme(fluentTheme);
        if (typeof Storage !== 'undefined') {
          saveThemeToLocalStorage(fluentTheme.name);
        }
      }
    }),
    [fluentTheme]
  );

  useEffect(() => {
    setFluentNorthStarTheme(
      mergeThemes(teamsTheme, {
        componentVariables: {
          Chat: {
            backgroundColor: fluentTheme.theme?.palette?.white
          },
          ChatMessage: {
            authorColor: fluentTheme.theme?.palette?.neutralDark,
            contentColor: fluentTheme.theme?.palette?.neutralDark,
            backgroundColor: fluentTheme.theme?.palette?.neutralLight,
            backgroundColorMine: fluentTheme.theme?.palette?.themeLight
          }
          // add more here to align theme for northstar components
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fluentTheme]);

  return (
    <FluentThemeContext.Provider value={themeMemo}>
      <ThemeProvider theme={fluentTheme.theme} className={wrapper} applyTo="body" style={{ display: 'inherit' }}>
        <Provider theme={fluentNorthStarTheme} className={wrapper} style={{ display: 'flex' }}>
          {children}
        </Provider>
      </ThemeProvider>
    </FluentThemeContext.Provider>
  );
};

/**
 * React hook for programmatically accessing the theme.
 */
export const useFluentTheme = (): SettableFluentThemeContext => useContext(FluentThemeContext);

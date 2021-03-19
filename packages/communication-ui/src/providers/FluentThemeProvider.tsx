// © Microsoft Corporation. All rights reserved.

import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { mergeStyles } from '@fluentui/react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';
import { THEMES, LIGHT, lightTheme, getThemeFromLocalStorage, saveThemeToLocalStorage } from '../constants/themes';

/**
 * type for theme state of FluentThemeProvider
 */
export type FluentTheme = {
  name: string;
  theme: PartialTheme | Theme;
};

/**
 * interface for React useContext hook containing the FluentTheme and a setter
 */
interface IFluentThemeContext {
  fluentTheme: FluentTheme;
  setFluentTheme: (fluentTheme: FluentTheme) => void;
}

const defaultTheme: FluentTheme = { name: LIGHT, theme: lightTheme };

/**
 * React useContext for FluentTheme state of FluentThemeProvider
 */
const FluentThemeContext = createContext<IFluentThemeContext>({
  fluentTheme: defaultTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setFluentTheme: (fluentTheme: FluentTheme) => {}
});

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
 * @description Provider to theme UI SDK core components. Since UI SDK core components are built with components
 * both from \@fluentui/react and \@fluentui/react-northstar, provider from these respective libraries are aligned
 * based on an assigned theme from \@fluentui/react
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

  const themeMemo = useMemo<IFluentThemeContext>(
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
    if (theme !== undefined) {
      _setFluentTheme(theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

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
export const useFluentTheme = (): IFluentThemeContext => useContext(FluentThemeContext);

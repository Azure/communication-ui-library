// © Microsoft Corporation. All rights reserved.

import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';
import { THEMES, LIGHT, lightTheme, getThemeFromLocalStorage } from '../constants/themes';

export type FluentTheme = {
  name: string;
  theme: PartialTheme | Theme;
};

interface IFluentThemeContext {
  fluentTheme: FluentTheme;
  setFluentTheme: (fluentTheme: FluentTheme) => void;
}

const defaultTheme: FluentTheme = { name: LIGHT, theme: lightTheme };

export const FluentThemeContext = createContext<IFluentThemeContext>({
  fluentTheme: defaultTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setFluentTheme: (fluentTheme: FluentTheme) => {}
});

interface FluentThemeProviderProps {
  children: React.ReactNode;
  theme?: FluentTheme;
}

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
      setFluentTheme: (fluentTheme: FluentTheme): void => _setFluentTheme(fluentTheme)
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
      <ThemeProvider theme={fluentTheme.theme} className="wrapper" applyTo="body" style={{ display: 'inherit' }}>
        <Provider theme={fluentNorthStarTheme} className="wrapper">
          {children}
        </Provider>
      </ThemeProvider>
    </FluentThemeContext.Provider>
  );
};

export const useFluentTheme = (): IFluentThemeContext => useContext(FluentThemeContext);

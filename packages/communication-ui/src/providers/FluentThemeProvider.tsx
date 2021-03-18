// © Microsoft Corporation. All rights reserved.

import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';
import { THEMES, lightTheme, getThemeFromLocalStorage } from '../constants/themes';

interface IFluentThemeContext {
  fluentTheme: PartialTheme | Theme;
  setFluentTheme: (theme: PartialTheme | Theme) => void;
}

export const FluentThemeContext = createContext<IFluentThemeContext>({
  fluentTheme: lightTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setFluentTheme: (theme: PartialTheme | Theme) => {}
});

interface FluentThemeProviderProps {
  children: React.ReactNode;
  theme?: PartialTheme | Theme;
}

export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { theme, children } = props;
  const themeFromStorage = getThemeFromLocalStorage();
  const defaultTheme = themeFromStorage && THEMES[themeFromStorage] ? THEMES[themeFromStorage] : lightTheme;
  const [fluentTheme, _setFluentTheme] = useState<PartialTheme | Theme>(theme ?? defaultTheme);
  const [fluentNorthStarTheme, setFluentNorthStarTheme] = useState<ThemeInput<any>>(teamsTheme);

  const themeMemo = useMemo<IFluentThemeContext>(
    () => ({
      fluentTheme: fluentTheme,
      setFluentTheme: (theme: PartialTheme | Theme): void => _setFluentTheme(theme)
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
            backgroundColor: fluentTheme?.palette?.white
          },
          ChatMessage: {
            authorColor: fluentTheme?.palette?.neutralDark,
            contentColor: fluentTheme?.palette?.neutralDark,
            backgroundColor: fluentTheme?.palette?.neutralLight,
            backgroundColorMine: fluentTheme?.palette?.themeLight
          }
          // add more here to align theme for northstar components
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fluentTheme]);

  return (
    <FluentThemeContext.Provider value={themeMemo}>
      <ThemeProvider theme={fluentTheme} className="wrapper" applyTo="body" style={{ display: 'inherit' }}>
        <Provider theme={fluentNorthStarTheme} className="wrapper">
          {children}
        </Provider>
      </ThemeProvider>
    </FluentThemeContext.Provider>
  );
};

export const useFluentTheme = (): IFluentThemeContext => useContext(FluentThemeContext);

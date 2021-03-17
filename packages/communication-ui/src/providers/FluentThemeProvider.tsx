// © Microsoft Corporation. All rights reserved.

import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';
import { lightTheme } from '../constants/themes';

interface FluentThemeProviderProps {
  children: React.ReactNode;
  theme?: PartialTheme | Theme;
}

interface IFluentThemeContext {
  fluentTheme: PartialTheme | Theme;
  setTheme: (theme: PartialTheme | Theme) => void;
}

export const FluentThemeContext = createContext<IFluentThemeContext>({
  fluentTheme: lightTheme,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setTheme: (theme: PartialTheme | Theme) => {}
});

export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { theme, children } = props;
  const [fluentTheme, setFluentTheme] = useState<PartialTheme | Theme>(theme ?? lightTheme);
  const [fluentNorthStarTheme, setFluentNorthStarTheme] = useState<ThemeInput<any>>(teamsTheme);

  const themeMemo = useMemo<IFluentThemeContext>(
    () => ({
      fluentTheme: fluentTheme,
      setTheme: (theme: PartialTheme | Theme): void => setFluentTheme(theme)
    }),
    [fluentTheme]
  );

  useEffect(() => {
    if (theme === undefined) {
      return;
    }
    setFluentTheme(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    setFluentNorthStarTheme(
      mergeThemes(teamsTheme, {
        componentVariables: {
          Chat: {
            backgroundColor: theme?.palette?.white
          },
          ChatMessage: {
            authorColor: theme?.palette?.neutralDark,
            contentColor: theme?.palette?.neutralDark,
            backgroundColor: theme?.palette?.neutralLight,
            backgroundColorMine: theme?.palette?.themeLight
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

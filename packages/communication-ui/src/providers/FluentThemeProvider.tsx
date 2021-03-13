// © Microsoft Corporation. All rights reserved.

import React, { useState, useEffect } from 'react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';

interface FluentThemeProviderProps {
  children: React.ReactNode;
  theme?: PartialTheme | Theme;
}

export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { theme, children } = props;
  const [fluentTheme, setFluentTheme] = useState<PartialTheme | Theme | undefined>(undefined);
  const [fluentNorthStarTheme, setFluentNorthStarTheme] = useState<ThemeInput<any>>(teamsTheme);

  useEffect(() => {
    setFluentTheme(theme);
    setFluentNorthStarTheme(
      mergeThemes(fluentNorthStarTheme, {
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
  }, [theme]);

  return (
    <ThemeProvider theme={fluentTheme} className="wrapper" applyTo="body" style={{ display: 'inherit' }}>
      <Provider theme={fluentNorthStarTheme} className="wrapper">
        {children}
      </Provider>
    </ThemeProvider>
  );
};

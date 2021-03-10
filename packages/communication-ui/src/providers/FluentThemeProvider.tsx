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
  const [themeState, setTheme] = useState<PartialTheme | Theme | undefined>(undefined);
  const [northstarTheme, setNorthstarTheme] = useState<ThemeInput<any>>({});

  useEffect(() => {
    setTheme(theme);
    setNorthstarTheme({
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
    });
  }, [theme]);

  return (
    <ThemeProvider theme={themeState} className="wrapper" applyTo="body" style={{ display: 'inherit' }}>
      <Provider theme={mergeThemes(teamsTheme, northstarTheme)} className="wrapper">
        {children}
      </Provider>
    </ThemeProvider>
  );
};

// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme } from '@fluentui/react-northstar';

interface FluentThemeProviderProps {
  children: React.ReactNode;
  theme?: PartialTheme | Theme;
}

export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { theme, children } = props;

  const northstarTheme = {
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
  };

  return (
    <ThemeProvider theme={theme} className="wrapper" applyTo="body" style={{ display: 'inherit' }}>
      <Provider theme={mergeThemes(teamsTheme, northstarTheme)} className="wrapper">
        {children}
      </Provider>
    </ThemeProvider>
  );
};

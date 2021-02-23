// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme } from '@fluentui/react-northstar';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';

interface FluentThemeProviderProps {
  children: React.ReactNode;
  theme?: PartialTheme | Theme;
}

export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { theme, children } = props;

  const northstarTheme = {
    componentStyles: {
      SvgIcon: svgIconStyles
    },
    componentVariables: {
      SvgIcon: svgIconVariables,
      Chat: {
        backgroundColor: theme?.palette?.white
      }
      // add more here to align theme for northstar components
    },
    siteVariables
  };

  return (
    <ThemeProvider theme={theme} className="wrapper" applyTo="body" style={{ display: 'inherit' }}>
      <Provider theme={mergeThemes(teamsTheme, northstarTheme)} className="wrapper">
        {children}
      </Provider>
    </ThemeProvider>
  );
};

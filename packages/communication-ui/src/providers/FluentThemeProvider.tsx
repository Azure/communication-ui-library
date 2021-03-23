// © Microsoft Corporation. All rights reserved.

import React, { useState, useEffect } from 'react';
import { mergeStyles } from '@fluentui/react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';

/**
 * Props for FluentThemeProvider
 */
export interface FluentThemeProviderProps {
  /** Children to be themed */
  children: React.ReactNode;
  /** Optional theme state for FluentThemeProvider */
  fluentTheme?: PartialTheme | Theme;
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
  const { fluentTheme, children } = props;
  const [fluentNorthStarTheme, setFluentNorthStarTheme] = useState<ThemeInput<any>>(teamsTheme);

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
    <ThemeProvider theme={fluentTheme} className={wrapper} style={{ display: 'inherit' }} applyTo="body">
      <Provider theme={fluentNorthStarTheme} className={wrapper} style={{ display: 'flex' }}>
        {children}
      </Provider>
    </ThemeProvider>
  );
};

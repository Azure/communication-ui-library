// © Microsoft Corporation. All rights reserved.

import React, { useState, useEffect } from 'react';
import { mergeStyles } from '@fluentui/react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react-theme-provider';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';
import { lightTheme } from '../constants/themes';

/**
 * Props for FluentThemeProvider
 */
export interface FluentThemeProviderProps {
  /** Children to be themed. */
  children: React.ReactNode;
  /** Optional theme state for FluentThemeProvider. Defaults to a light theme if not provided. */
  fluentTheme?: PartialTheme | Theme;
}

const wrapper = mergeStyles({
  height: '100%',
  width: '100%'
});

const initialFluentNorthstarTheme = mergeThemes(teamsTheme, {
  componentVariables: {
    // suppressing teams theme for chat message links to get better styling from Fluent UI Link
    ChatMessage: {
      linkColor: undefined,
      linkColorMine: undefined
    }
  }
});

/**
 * @description Provider to apply theme ACS UI SDK core components. ACS UI SDK core components are built
 * with components mostly from [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/controls/web)
 * and a few from [Fluent React Northstar](https://fluentsite.z22.web.core.windows.net/0.53.0). So we
 * theme from Fluent UI is used to align the few components from Fluent React Northstar.
 * @param props - FluentThemeProviderProps
 */
export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { fluentTheme, children } = props;
  // if fluentTheme is not provided, default to light theme
  const fluentUITheme = fluentTheme ?? lightTheme;
  const [fluentNorthstarTheme, setFluentNorthstarTheme] = useState<ThemeInput<any>>(initialFluentNorthstarTheme);

  useEffect(() => {
    setFluentNorthstarTheme(
      mergeThemes(initialFluentNorthstarTheme, {
        componentVariables: {
          Chat: {
            backgroundColor: fluentUITheme?.palette?.white
          },
          ChatMessage: {
            authorColor: fluentUITheme?.palette?.neutralPrimary,
            contentColor: fluentUITheme?.palette?.neutralPrimary,
            backgroundColor: fluentUITheme?.palette?.neutralLighter,
            backgroundColorMine: fluentUITheme?.palette?.themeLight
          }
        },
        componentStyles: {
          ChatMessage: {
            timestamp: {
              WebkitTextFillColor: fluentUITheme?.palette?.neutralSecondary
            }
          }
        }
        // add more northstar components to align with Fluent UI theme
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fluentUITheme]);

  return (
    <ThemeProvider theme={fluentUITheme} className={wrapper}>
      <Provider theme={fluentNorthstarTheme} className={wrapper}>
        {children}
      </Provider>
    </ThemeProvider>
  );
};

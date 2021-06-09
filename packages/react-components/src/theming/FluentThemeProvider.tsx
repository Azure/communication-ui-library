// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
import { mergeStyles } from '@fluentui/react';
import { ThemeProvider, Theme, PartialTheme } from '@fluentui/react';
import { mergeThemes, Provider, teamsTheme, ThemeInput } from '@fluentui/react-northstar';
import { lightTheme } from './themes';

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
 * @description Provider to apply a Fluent theme across this library's react components.
 * @remarks Components in this library are composed primarily from [Fluent UI](https://developer.microsoft.com/en-us/fluentui#/controls/web),
 * controls, and also from [Fluent React Northstar](https://fluentsite.z22.web.core.windows.net/0.53.0) controls.
 * This provider handles applying any theme provided to both the underlying Fluent UI controls, as well as the Fluent React Northstar controls.
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

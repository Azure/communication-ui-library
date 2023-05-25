// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { ThemeProvider, Theme, PartialTheme, getTheme, mergeThemes, mergeStyles } from '@fluentui/react';
import { mergeThemes as mergeNorthstarThemes, Provider, teamsTheme } from '@internal/northstar-wrapper';
import { lightTheme } from './themes';

/**
 * Props for {@link FluentThemeProvider}.
 *
 * @public
 */
export interface FluentThemeProviderProps {
  /** Children to be themed. */
  children: React.ReactNode;
  /** Theme for components. Defaults to a light theme if not provided. */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Whether components are displayed right-to-left
   * @defaultValue `false`
   */
  rtl?: boolean;
}

const wrapper = mergeStyles({
  height: '100%',
  width: '100%',
  overflow: 'auto'
});

const defaultTheme = mergeThemes(getTheme(), lightTheme);

/** Theme context for library's react components */
const ThemeContext = createContext<Theme>(defaultTheme);

const initialFluentNorthstarTheme = mergeNorthstarThemes(teamsTheme, {
  componentStyles: {
    ChatMessage: {
      root: {
        lineHeight: '1.4286'
      }
    }
  },
  fontFaces: [], // suppressing font faces from teamsTheme as recommended by FluentUI N* to avoid font styling to other elements
  siteVariables: {
    // suppressing body styles from teamsTheme to avoid inherited styling to other elements
    bodyPadding: undefined,
    bodyFontSize: undefined,
    bodyFontFamily: undefined,
    bodyBackground: undefined,
    bodyColor: undefined,
    bodyLineHeight: undefined
  }
});

/**
 * Provider to apply a Fluent theme across this library's react components.
 *
 * @remarks Components in this library are composed primarily from [Fluent UI](https://developer.microsoft.com/fluentui#/controls/web),
 * controls, and also from [Fluent React Northstar](https://fluentsite.z22.web.core.windows.net/0.53.0) controls.
 * This provider handles applying any theme provided to both the underlying Fluent UI controls, as well as the Fluent React Northstar controls.
 *
 * @public
 */
export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { fluentTheme, rtl, children } = props;

  let fluentUITheme: Theme = mergeThemes(defaultTheme, fluentTheme);
  // merge in rtl from FluentThemeProviderProps
  fluentUITheme = mergeThemes(fluentUITheme, { rtl });

  const fluentNorthstarTheme = mergeNorthstarThemes(initialFluentNorthstarTheme, {
    componentVariables: {
      Chat: {
        backgroundColor: fluentUITheme.palette.white
      },
      ChatMessage: {
        authorColor: fluentUITheme.palette.neutralPrimary,
        contentColor: fluentUITheme.palette.neutralPrimary,
        backgroundColor: fluentUITheme.palette.neutralLighter,
        backgroundColorMine: fluentUITheme.palette.themeLight
      }
    },
    componentStyles: {
      ChatMessage: {
        timestamp: {
          WebkitTextFillColor: fluentUITheme.palette.neutralSecondary
        }
      }
    }
    // add more northstar components to align with Fluent UI theme
  });

  return (
    <ThemeContext.Provider value={fluentUITheme}>
      <ThemeProvider theme={fluentUITheme} className={wrapper}>
        <Provider theme={fluentNorthstarTheme} className={wrapper} rtl={rtl}>
          {children}
        </Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * React hook to access theme
 *
 * @public
 */
export const useTheme = (): Theme => useContext(ThemeContext);

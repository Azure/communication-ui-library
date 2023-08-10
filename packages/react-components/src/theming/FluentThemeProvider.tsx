// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { ThemeProvider, Theme, PartialTheme, getTheme, mergeThemes, mergeStyles } from '@fluentui/react';
import { FluentProvider } from '@fluentui/react-components';
import { createV9Theme } from '@fluentui/react-migration-v8-v9';
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

/**
 * Provider to apply a Fluent theme across this library's react components.
 *
 * @remarks Components in this library are composed primarily from [Fluent UI](https://developer.microsoft.com/fluentui#/controls/web),
 * controls, mixing v8 and v9 controls.
 * This provider handles applying any theme provided to the underlying Fluent UI controls.
 *
 * @public
 */
export const FluentThemeProvider = (props: FluentThemeProviderProps): JSX.Element => {
  const { fluentTheme, rtl, children } = props;

  let fluentUITheme: Theme = mergeThemes(defaultTheme, fluentTheme);
  // merge in rtl from FluentThemeProviderProps
  fluentUITheme = mergeThemes(fluentUITheme, { rtl });

  return (
    <ThemeContext.Provider value={fluentUITheme}>
      <ThemeProvider theme={fluentUITheme} className={wrapper}>
        <FluentProvider className={wrapper} theme={createV9Theme(fluentUITheme)}>
          {children}
        </FluentProvider>
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

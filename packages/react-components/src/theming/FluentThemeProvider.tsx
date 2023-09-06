// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { ThemeProvider, PartialTheme, Theme, getTheme, mergeThemes, mergeStyles } from '@fluentui/react';
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
  // Add NorthStar styling used in the library
  body: {
    padding: undefined,
    margin: undefined,
    fontSize: undefined,
    font: undefined,
    lineHeight: 1.4286
  },
  '*': {
    boxSizing: 'border-box'
  },
  '*:before': {
    boxSizing: 'border-box'
  },
  '*:after': {
    boxSizing: 'border-box'
  },
  /* Adding priority for HTML `hidden` attribute to be applied correctly */
  '[hidden]': {
    display: 'none!important'
  }
});

const defaultTheme: Theme = {
  ...mergeThemes(getTheme(), lightTheme)
};

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

  let fluentV8Theme: Theme = mergeThemes(defaultTheme, fluentTheme);

  // merge in rtl from FluentThemeProviderProps
  fluentV8Theme = mergeThemes(fluentV8Theme, { rtl });
  return (
    <ThemeContext.Provider value={fluentV8Theme}>
      <ThemeProvider theme={fluentV8Theme} className={wrapper}>
        {children}
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

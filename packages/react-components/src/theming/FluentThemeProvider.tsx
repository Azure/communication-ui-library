// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { ThemeProvider, PartialTheme, Theme as V8Theme, getTheme, mergeThemes, mergeStyles } from '@fluentui/react';
import { FluentProvider, Theme as V9Theme, teamsLightTheme } from '@fluentui/react-components';
import { Theme, lightTheme } from './themes';

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
  margin: 0,
  overflow: 'hidden',
  padding: 0,
  width: '100%'
});

const defaultTheme: Theme = {
  ...mergeThemes(getTheme(), lightTheme),
  fluent9Theme: { ...teamsLightTheme, ...lightTheme.fluent9Theme }
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
  const v8Theme: Omit<V8Theme, 'fluent9Theme'> = defaultTheme;

  let fluentV8Theme: V8Theme = mergeThemes(v8Theme, fluentTheme);
  const fluentV9Theme: V9Theme = { ...defaultTheme.fluent9Theme };

  // merge in rtl from FluentThemeProviderProps
  fluentV8Theme = mergeThemes(fluentV8Theme, { rtl });

  const combinedThemes: Theme = { ...fluentV8Theme, fluent9Theme: fluentV9Theme };

  return (
    <ThemeContext.Provider value={combinedThemes}>
      <ThemeProvider theme={fluentV8Theme} className={wrapper}>
        <FluentProvider className={wrapper} theme={fluentV9Theme}>
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

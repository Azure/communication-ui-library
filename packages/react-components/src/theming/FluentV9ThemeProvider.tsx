// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { makeStyles, shorthands, FluentProvider } from '@fluentui/react-components';
import { Theme as ThemeV8 } from '@fluentui/react';
import { createV9Theme } from './v9ThemeShim';

/**
 * Props for {@link FluentThemeProvider}.
 *
 * @private
 */
export interface FluentV9ThemeProviderProps {
  /** Children to be themed. */
  children: React.ReactNode;
  /** FluentUI v8 theme to be mapped to FluentUI v9 theme */
  v8Theme: ThemeV8;
}

/**
 * @private
 */
export const useFluentV9Wrapper = makeStyles({
  body: {
    height: '100%',
    ...shorthands.margin(0),
    ...shorthands.overflow('hidden'),
    ...shorthands.padding(0),
    width: '100%'
  }
});

/**
 * Provider to apply a Fluent V9 theme to react components.
 *
 *
 * @private
 */
export const FluentV9ThemeProvider = (props: FluentV9ThemeProviderProps): JSX.Element => {
  const { v8Theme, children } = props;
  const v9Theme = createV9Theme(v8Theme);

  // This class wrapper is needed to ensure the useFluentV9Wrapper hook
  // is called within the context of FluentProvider
  interface ClassWrapperProps {
    children: React.ReactNode;
  }
  const ClassWrapper = (props: ClassWrapperProps): JSX.Element => {
    const { children } = props;
    const fluentV9Wrapper = useFluentV9Wrapper();

    return <div className={fluentV9Wrapper.body}>{children}</div>;
  };

  return (
    <FluentProvider theme={v9Theme} dir={v8Theme.rtl ? 'rtl' : 'ltr'}>
      <ClassWrapper>{children}</ClassWrapper>
    </FluentProvider>
  );
};

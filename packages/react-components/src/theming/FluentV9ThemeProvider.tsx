// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { makeStyles, shorthands, FluentProvider, FluentProviderProps, mergeClasses } from '@fluentui/react-components';
import { Theme as ThemeV8 } from '@fluentui/react';
import { createV9Theme } from './v9ThemeShim';
import { TextDirectionProvider } from '@griffel/react';

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
  className?: string;
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
 * @private
 */
export const FluentV9ThemeProvider = (props: FluentV9ThemeProviderProps): JSX.Element => {
  const { v8Theme, children, className } = props;
  const v9Theme = createV9Theme(v8Theme);
  const dir = v8Theme.rtl ? 'rtl' : 'ltr';
  return (
    // TextDirectionProvider is needed to fix issue with direction value update in FluentProvider
    <TextDirectionProvider dir={dir}>
      {/* Wrapper is required to call "useClasses" hook with proper context values */}
      <FluentProviderWithStylesOverrides theme={v9Theme} dir={dir} className={className}>
        {children}
      </FluentProviderWithStylesOverrides>
    </TextDirectionProvider>
  );
};

const FluentProviderWithStylesOverrides: React.FC<FluentProviderProps> = (props) => {
  const classes = useFluentV9Wrapper();
  return (
    <FluentProvider {...props} className={mergeClasses(props.className, classes.body)} applyStylesToPortals={false} />
  );
};

import React from 'react';
import { Theme, useTheme } from '@fluentui/react-theme-provider';

export interface ThemeProps {
  theme: Theme;
}

export type WithTheme<T> = T & ThemeProps;

export function withThemeContext<OriginalProps>(
  Component: React.ComponentType<OriginalProps & ThemeProps>
): React.ComponentType<OriginalProps> {
  const ThemeConsumerComponent = (props: OriginalProps): JSX.Element => {
    return <Component {...props} theme={useTheme()} />;
  };
  return ThemeConsumerComponent;
}

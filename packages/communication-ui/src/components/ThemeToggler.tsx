// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Toggle, mergeStyles } from '@fluentui/react';
import { defaultThemes } from '../theming';
import { NamedTheme } from '../types';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { themeTogglerStyles } from './styles/ThemeToggler.styles';

/**
 * Props for ThemeToggler component
 */
export interface ThemeTogglerProps {
  /** Optional theme name for the on state of the toggler. Default is 'dark' theme. */
  onTheme?: NamedTheme;
  /** Optional theme name of off state of the toggler. Default is 'light' theme. */
  offTheme?: NamedTheme;
  /** Optional label for toggler component */
  label?: string;
  /** Optional layout styling for toggler component */
  layout?: string;
}

/**
 * @description Toggler component for toggling the fluent theme context for SwitchableFluentThemeProvider
 * @param props - ThemeTogglerProps
 * @remarks - this must be a child of a SwitchableFluentThemeProvider
 */
export const ThemeToggler = (props: ThemeTogglerProps): JSX.Element => {
  const { onTheme, offTheme, label, layout } = props;
  const { currentTheme, setCurrentTheme } = useSwitchableFluentTheme();

  const _onTheme: NamedTheme = onTheme ? onTheme : defaultThemes.dark;
  const _offTheme: NamedTheme = offTheme ? offTheme : defaultThemes.light;

  const onChange = (ev: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
    if (checked) {
      setCurrentTheme(_onTheme);
    } else {
      setCurrentTheme(_offTheme);
    }
  };

  const themeComponentStyle = layout && themeTogglerStyles[layout] ? themeTogglerStyles[layout] : {};

  return (
    <div className={mergeStyles(themeComponentStyle)}>
      <Toggle
        label={label}
        onText={_onTheme.name}
        offText={_offTheme.name}
        onChange={onChange}
        checked={currentTheme.name === _onTheme.name}
      />
    </div>
  );
};

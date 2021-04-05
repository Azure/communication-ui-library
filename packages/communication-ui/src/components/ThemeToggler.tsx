// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Toggle, mergeStyles } from '@fluentui/react';
import { LIGHT, DARK, lightTheme, darkTheme } from '../constants/themes';
import { useSwitchableFluentTheme, FluentTheme } from '../providers/SwitchableFluentThemeProvider';
import { themeTogglerStyles } from './styles/ThemeToggler.styles';

/**
 * Props for ThemeToggler component
 */
export interface ThemeTogglerProps {
  /** Optional theme name for the on state of the toggler. Default is 'dark' theme. */
  onTheme?: FluentTheme;
  /** Optional theme name of off state of the toggler. Default is 'light' theme. */
  offTheme?: FluentTheme;
  /** Optional label for toggler component */
  label?: string;
  /** Optional layout styling for toggler component */
  layout?: string;
}

/**
 * @description Toggler component for toggling the fluent theme context for SwitchableFluentThemeProvider
 * @param props - ThemeTogglerProps
 */
export const ThemeToggler = (props: ThemeTogglerProps): JSX.Element => {
  const { onTheme, offTheme, label, layout } = props;
  const { fluentTheme, setFluentTheme } = useSwitchableFluentTheme();

  const _onTheme: FluentTheme = onTheme ? onTheme : { name: DARK, theme: darkTheme };
  const _offTheme: FluentTheme = offTheme ? offTheme : { name: LIGHT, theme: lightTheme };

  const onChange = (ev: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
    if (checked) {
      setFluentTheme(_onTheme);
    } else {
      setFluentTheme(_offTheme);
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
        checked={fluentTheme.name === _onTheme.name}
      />
    </div>
  );
};

// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Toggle } from '@fluentui/react';
import { THEMES, LIGHT, DARK } from '../constants/themes';
import { useFluentTheme } from '../providers/FluentThemeProvider';
import { themeSelectorContainer } from './styles/ThemeSelector.styles';

/**
 * Props for ThemeToggler component
 */
export type ThemeTogglerProps = {
  /** Optional theme name for the on state of the toggler. Default is 'dark' theme. */
  onTheme?: string;
  /** Optional theme name of off state of the toggler. Default is 'light' theme. */
  offTheme?: string;
};

/**
 * @description Toggler component for switching the theme context with respect to components inside FluentThemeProvider.
 * @param props - ThemeTogglerProps
 */
export const ThemeToggler = (props: ThemeTogglerProps): JSX.Element => {
  const { onTheme, offTheme } = props;
  const { fluentTheme, setFluentTheme } = useFluentTheme();

  const _onTheme = onTheme ? onTheme : DARK;
  const _offTheme = offTheme ? offTheme : LIGHT;

  const onChange = (ev: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
    if (checked) {
      setFluentTheme({ name: _onTheme, theme: THEMES[_onTheme] });
    } else {
      setFluentTheme({ name: _offTheme, theme: THEMES[_offTheme] });
    }
  };

  return (
    <div className={themeSelectorContainer}>
      <Toggle
        label="Theme"
        onText={_onTheme}
        offText={_offTheme}
        onChange={onChange}
        defaultChecked={fluentTheme.name === _onTheme}
      />
    </div>
  );
};

// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Toggle } from '@fluentui/react';
import { THEMES, LIGHT, DARK, getThemeFromLocalStorage, saveThemeToLocalStorage } from '../constants/themes';
import { useFluentTheme } from '../providers/FluentThemeProvider';
import { themeSelectorContainer } from './styles/ThemeSelector.styles';

export type ThemeTogglerProps = {
  onTheme?: string;
  offTheme?: string;
};

export const ThemeToggler = (props: ThemeTogglerProps): JSX.Element => {
  const { onTheme, offTheme } = props;
  const { setFluentTheme } = useFluentTheme();

  const _onTheme = onTheme ? onTheme : DARK;
  const _offTheme = offTheme ? offTheme : LIGHT;

  const onChange = (ev: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
    if (checked) {
      setFluentTheme(THEMES[_onTheme]);
      if (typeof Storage !== 'undefined') {
        saveThemeToLocalStorage(_onTheme);
      }
    } else {
      setFluentTheme(THEMES[_offTheme]);
      if (typeof Storage !== 'undefined') {
        saveThemeToLocalStorage(_offTheme);
      }
    }
  };

  const themeFromStorage = getThemeFromLocalStorage();

  return (
    <div className={themeSelectorContainer}>
      <Toggle
        label="Theme"
        onText={_onTheme}
        offText={_offTheme}
        onChange={onChange}
        defaultChecked={themeFromStorage === _onTheme}
      />
    </div>
  );
};

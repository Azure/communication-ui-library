// © Microsoft Corporation. All rights reserved.

import React, { useCallback } from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { THEMES, getThemeFromLocalStorage, saveThemeToLocalStorage } from '../constants/themes';
import { useFluentTheme } from '../providers/FluentThemeProvider';
import { themeSelectorContainer } from './styles/ThemeSelector.styles';

export const ThemeSelector = (): JSX.Element => {
  const { fluentTheme, setFluentTheme } = useFluentTheme();

  const onChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
      if (option) {
        const themeName = option.key.toString();
        const theme = THEMES[themeName];
        setFluentTheme(theme);
        if (typeof Storage !== 'undefined') {
          saveThemeToLocalStorage(themeName);
        }
      }
    },
    [fluentTheme, setFluentTheme]
  );

  return (
    <div className={themeSelectorContainer}>
      <Dropdown
        options={Object.keys(THEMES).map((theme) => ({
          key: theme,
          text: theme
        }))}
        onChange={onChange}
        label="Theme"
        selectedKey={getThemeFromLocalStorage()}
      />
    </div>
  );
};

// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { THEMES, saveThemeToLocalStorage } from '../constants/themes';
import { useFluentTheme } from '../providers/FluentThemeProvider';
import { themeSelectorContainer } from './styles/ThemeSelector.styles';

export const ThemeSelector = (): JSX.Element => {
  const { fluentTheme, setFluentTheme } = useFluentTheme();

  const onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined): void => {
    if (option) {
      const themeName = option.key.toString();
      const theme = THEMES[themeName];
      setFluentTheme({ name: themeName, theme: theme });
      if (typeof Storage !== 'undefined') {
        saveThemeToLocalStorage(themeName);
      }
    }
  };

  return (
    <div className={themeSelectorContainer}>
      <Dropdown
        options={Object.keys(THEMES).map((theme) => ({
          key: theme,
          text: theme
        }))}
        onChange={onChange}
        label="Theme"
        selectedKey={fluentTheme.name}
      />
    </div>
  );
};

// © Microsoft Corporation. All rights reserved.

import React, { useCallback } from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { lightTheme, darkTheme } from '../constants/themes';
import { useFluentTheme } from '../providers/FluentThemeProvider';
import { themeSelectorContainer } from './styles/ThemeSelector.styles';

const THEME = 'Theme';

const getThemeFromLocalStorage = (): string | null => window.localStorage.getItem(THEME);

const saveThemeToLocalStorage = (theme: string): void => window.localStorage.setItem(THEME, theme);

export const ThemeSelector = (): JSX.Element => {
  const { fluentTheme, setTheme } = useFluentTheme();
  setTheme(getThemeFromLocalStorage() === 'dark' ? darkTheme : lightTheme);

  const onChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
      if (option) {
        const themeName = option.key.toString();
        const theme = themeName === 'dark' ? darkTheme : lightTheme;
        setTheme(theme);
        if (typeof Storage !== 'undefined') {
          saveThemeToLocalStorage(themeName);
        }
      }
    },
    [fluentTheme, setTheme]
  );

  return (
    <div className={themeSelectorContainer}>
      <Dropdown
        options={['light', 'dark'].map((theme) => ({
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

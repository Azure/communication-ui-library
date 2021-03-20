// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { THEMES, ThemeMap } from '../constants/themes';
import { useSwitchableFluentTheme } from '../providers/SwitchableFluentThemeProvider';
import { themeSelectorContainer } from './styles/ThemeSelector.styles';

/**
 * Props for ThemeSelector component
 */
export interface ThemeSelectorProps {
  /** Optional map of themes with theme as the key. Defaults to map of light and dark themes. */
  themeMap?: ThemeMap;
}

/**
 * @description Dropdown component for selecting the theme context with respect to components inside FluentThemeProvider.
 * @param props - ThemeSelectorProps
 */
export const ThemeSelector = (props: ThemeSelectorProps): JSX.Element => {
  const { themeMap } = props;
  const { fluentTheme, setFluentTheme } = useSwitchableFluentTheme();

  const themes = themeMap ? themeMap : THEMES;

  const onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined): void => {
    if (option) {
      const themeName = option.key.toString();
      const theme = THEMES[themeName];
      setFluentTheme({ name: themeName, theme: theme });
    }
  };

  return (
    <div className={themeSelectorContainer}>
      <Dropdown
        options={Object.keys(themes).map((theme) => ({
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

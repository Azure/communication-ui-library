// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Dropdown, IDropdownOption, mergeStyles } from '@fluentui/react';
import { THEMES, ThemeMap } from '../constants/themes';
import { useSwitchableFluentTheme } from '../providers/SwitchableFluentThemeProvider';
import { themeComponentStyles } from './styles/ThemeComponent.styles';

/**
 * Props for ThemeSelector component
 */
export interface ThemeSelectorProps {
  /** Optional map of themes with theme as the key. Defaults to map of light and dark themes. */
  themeMap?: ThemeMap;
  /** Optional label for selector component */
  label?: string;
  /** Optional layout styling for selector component */
  layout?: string;
}

/**
 * @description Dropdown component for selecting the theme context with respect to components inside FluentThemeProvider.
 * @param props - ThemeSelectorProps
 */
export const ThemeSelector = (props: ThemeSelectorProps): JSX.Element => {
  const { themeMap, label, layout } = props;
  const { fluentTheme, setFluentTheme } = useSwitchableFluentTheme();

  const themes = themeMap ? themeMap : THEMES;

  const onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined): void => {
    if (option) {
      const themeName = option.key.toString();
      const theme = THEMES[themeName];
      setFluentTheme({ name: themeName, theme: theme });
    }
  };

  const themeComponentStyle = layout && themeComponentStyles[layout] ? themeComponentStyles[layout] : {};

  return (
    <div className={mergeStyles(themeComponentStyle)}>
      <Dropdown
        label={label}
        options={Object.keys(themes).map((theme) => ({
          key: theme,
          text: theme
        }))}
        onChange={onChange}
        selectedKey={fluentTheme.name}
      />
    </div>
  );
};

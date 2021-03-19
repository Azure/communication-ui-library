// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { THEMES, ThemeMap } from '../constants/themes';
import { useFluentTheme } from '../providers/FluentThemeProvider';
import { themeSelectorContainer } from './styles/ThemeSelector.styles';

/**
 * Props for ThemeSelector component
 */
export type ThemeSelectorProps = {
  /** Optional map of themes with theme as the key. Defaults to map of light and dark themes. */
  themes?: ThemeMap;
};

/**
 * @description Dropdown component for selecting the theme context with respect to components inside FluentThemeProvider.
 * @param props - ThemeSelectorProps
 */
export const ThemeSelector = (props: ThemeSelectorProps): JSX.Element => {
  const { themes } = props;
  const { fluentTheme, setFluentTheme } = useFluentTheme();

  const _themes = themes ? themes : THEMES;

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
        options={Object.keys(_themes).map((theme) => ({
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

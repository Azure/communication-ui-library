// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { ChoiceGroup, IChoiceGroupOption, concatStyleSets } from '@fluentui/react';
import { THEMES, ThemeMap } from '../constants/themes';
import { useSwitchableFluentTheme } from '../providers/SwitchableFluentThemeProvider';

/**
 * Props for ThemeSelector component
 */
export interface ThemeSelectorProps {
  /** Optional map of themes with theme as the key. Defaults to map of light and dark themes. */
  themeMap?: ThemeMap;
  /** Optional label for selector component */
  label?: string;
  /** Optional boolean to arrange choices horizontally */
  horizontal?: boolean;
}

/**
 * @description ChoiceGroup component for selecting the fluent theme context for SwitchableFluentThemeProvider
 * @param props - ThemeSelectorProps
 */
export const ThemeSelector = (props: ThemeSelectorProps): JSX.Element => {
  const { themeMap, label, horizontal } = props;
  const { fluentTheme, setFluentTheme } = useSwitchableFluentTheme();

  const themes = themeMap ? themeMap : THEMES;

  const onChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option?: IChoiceGroupOption | undefined
  ): void => {
    if (option) {
      const themeName = option.key.toString();
      const theme = THEMES[themeName];
      setFluentTheme({ name: themeName, theme: theme });
    }
  };

  return (
    <ChoiceGroup
      label={label}
      options={Object.keys(themes).map((theme) => ({
        key: theme,
        text: theme,
        styles: concatStyleSets(
          { root: { marginTop: '0' } },
          horizontal ? { choiceFieldWrapper: { marginRight: '1rem' } } : undefined
        )
      }))}
      onChange={onChange}
      selectedKey={fluentTheme.name}
      styles={concatStyleSets(
        { label: { padding: '0' } },
        horizontal ? { flexContainer: { display: 'flex' } } : undefined
      )}
    />
  );
};

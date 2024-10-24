// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ChoiceGroup, IChoiceGroupOption, concatStyleSets } from '@fluentui/react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';

/**
 * Props for ThemeSelector component
 */
export interface ThemeSelectorProps {
  /** Optional label for selector component */
  label?: string;
  /** Optional boolean to arrange choices horizontally */
  horizontal?: boolean;
}

/**
 * @description ChoiceGroup component for selecting the fluent theme context for SwitchableFluentThemeProvider
 * @param props - ThemeSelectorProps
 * @remarks - this must be a child of a SwitchableFluentThemeProvider
 */
export const ThemeSelector = (props: ThemeSelectorProps): JSX.Element => {
  const { label, horizontal } = props;
  const { currentTheme, setCurrentTheme, themeStore } = useSwitchableFluentTheme();

  const onChange = (
    ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option?: IChoiceGroupOption | undefined
  ): void => {
    if (option) {
      const themeName = option.key.toString();
      const theme = themeStore[themeName];

      if (!theme) {
        throw new Error(`Theme ${themeName} not found in theme store`);
      }

      setCurrentTheme(theme);
    }
  };

  return (
    <ChoiceGroup
      label={label}
      options={Object.keys(themeStore).map((theme) => ({
        key: theme,
        text: theme,
        styles: concatStyleSets(
          { root: { marginTop: '0' } },
          horizontal ? { choiceFieldWrapper: { marginRight: '1rem' } } : undefined
        )
      }))}
      onChange={onChange}
      selectedKey={currentTheme.name}
      styles={concatStyleSets(
        { label: { padding: '0' } },
        horizontal ? { flexContainer: { display: 'flex' } } : undefined
      )}
    />
  );
};

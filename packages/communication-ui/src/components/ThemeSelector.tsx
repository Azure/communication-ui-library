import React, { useCallback } from 'react';
import { Dropdown, IDropdownOption, mergeStyles } from '@fluentui/react';
import { lightTheme, darkTheme, useFluentTheme } from '../providers/FluentThemeProvider';

export const languageSelectorContainer = mergeStyles({
  width: '100%',
  maxWidth: '18.75rem',
  minWidth: '12.5rem',
  maxHeight: '14.125rem',
  marginTop: '2.125rem'
});

export const ThemeSelector = () => {
  const { fluentTheme, setTheme } = useFluentTheme();

  const onChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
      if (option) {
        const themeName = option.key.toString();
        const theme = themeName === 'dark' ? darkTheme : lightTheme;
        setTheme(theme);
      }
    },
    [fluentTheme, setTheme]
  );

  return (
    <div className={languageSelectorContainer}>
      <Dropdown
        options={['light', 'dark'].map((theme) => ({
          key: theme,
          text: theme
        }))}
        onChange={onChange}
        label="Theme"
      />
    </div>
  );
};

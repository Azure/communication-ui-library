import {
  LocalizationProvider,
  COMPONENT_LOCALE_EN_US,
  COMPONENT_LOCALE_FR_FR,
  COMPONENT_LOCALE_JA_JP,
  CameraButton
} from '@azure/communication-react';
import { Dropdown, IDropdownOption } from '@fluentui/react';
import React, { useState, useCallback } from 'react';

export const AsyncLocalesSnippet = (): JSX.Element => {
  const [localeTag, setLocaleTag] = useState('en-US');
  const asyncLocale = useCallback(async () => {
    switch (localeTag) {
      case 'fr-FR':
        // could be an awaited function here
        return COMPONENT_LOCALE_FR_FR;
      case 'ja-JP':
        return COMPONENT_LOCALE_JA_JP;
      default:
        return COMPONENT_LOCALE_EN_US;
    }
  }, [localeTag]);

  const onChange = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
    if (option?.key) {
      setLocaleTag(option?.key as string);
    }
  };

  return (
    <>
      <Dropdown
        onChange={onChange}
        options={[
          { key: 'en_US', text: 'English (US)', selected: true },
          { key: 'fr-FR', text: 'French (France)' },
          { key: 'ja-JP', text: 'Japanese (Japan)' }
        ]}
      />
      <LocalizationProvider localeLoader={asyncLocale}>
        <CameraButton showLabel />
      </LocalizationProvider>
    </>
  );
};

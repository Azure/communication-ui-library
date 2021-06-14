// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react';

import { useLocale } from 'react-components';

export const LanguageSelector = (): JSX.Element => {
  const { locale, setLocale, locales } = useLocale();

  const onChange = useCallback(
    (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined) => {
      if (option) {
        const locale = option.key.toString();
        setLocale(locale);
      }
    },
    [setLocale]
  );

  return (
    <Dropdown
      options={Object.keys(locales).map((loc) => ({
        key: loc,
        text: locales[loc].displayName
      }))}
      onChange={onChange}
      label="Select a language"
      selectedKey={locale.locale}
    />
  );
};

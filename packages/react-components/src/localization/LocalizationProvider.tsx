// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import en_US from './translated/en-US.json';

export interface ILocale {
  locale: string;
  rtl: boolean;
  strings: ILocaleKeys;
}

export type ILocaleKeys = Record<string, string>;

export const LocaleContext = createContext<ILocale>({
  locale: 'en-US',
  strings: en_US,
  rtl: false
});

export type LocalizationProviderProps = {
  locale: ILocale;
  children: React.ReactNode;
};

export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): ILocale => useContext(LocaleContext);

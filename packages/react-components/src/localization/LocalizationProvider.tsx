// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import en_US from './translated/en-US.json';

/**
 * Locale information used to change strings, rtl, and font-size in components
 */
export interface ILocale {
  locale: string;
  rtl: boolean;
  strings: ILocaleKeys;
}

/**
 * Locale keys to apply to component strings
 */
export type ILocaleKeys = Record<string, string>;

/**
 * Context for LocalizationProvider
 */
export const LocaleContext = createContext<ILocale>({
  locale: 'en-US',
  strings: en_US,
  rtl: false
});

/**
 * Props to LocalizationProvider
 */
export type LocalizationProviderProps = {
  locale: ILocale;
  children: React.ReactNode;
};

/**
 * @description Provider to provide localized strings for this library's react components.
 * @remarks Components will be provided localized strings in English (US) by default if this
 * provider is not used
 */
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): ILocale => useContext(LocaleContext);

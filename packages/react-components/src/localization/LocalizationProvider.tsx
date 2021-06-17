// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import en_US from './translated/en-US.json';

/**
 * Locale information used to change strings, rtl, and language in components
 */
export interface ILocale {
  /** Language code */
  lang: string;
  /** Whether to present right-to-left */
  rtl: boolean;
  /** Set of strings for components */
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
  lang: 'en-US',
  strings: en_US,
  rtl: false
});

/**
 * Props to LocalizationProvider
 */
export type LocalizationProviderProps = {
  /** Locale context to provide components */
  locale: ILocale;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * @description Provider to provide localized strings, rtl, and language for this library's react components.
 * @remarks Components will be provided localized strings in English (US) by default if this
 * provider is not used
 */
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): ILocale => useContext(LocaleContext);

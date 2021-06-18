// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import en_US from './translated/en-US.json';

/**
 * Locale keys to apply to component strings
 */
export type ILocaleKeys = Record<string, string>;

/**
 * Locale information to change strings in components
 */
export interface ILocale {
  /** Set of strings for components */
  localeStrings: ILocaleKeys;
}

/**
 * Context for providing localized strings to components
 */
export const LocaleContext = createContext<ILocale>({
  localeStrings: en_US
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
 * @description Provider to provide localized strings for this library's react components.
 * @remarks Components will be provided localized strings in English (US) by default if this
 * provider is not used
 */
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): ILocale => useContext(LocaleContext);

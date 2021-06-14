// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { defaultLocaleDataLoader, locales } from './loadLocaleData';
import defaultStrings from './translated/en-US.json';

const LOCALE_CACHE_KEY = 'AzureCommunicationUI_Locale';

export interface ILocale {
  locale: string;
  englishName: string;
  displayName: string;
  rtl: boolean;
}

/**
 * Collection of NamedThemes
 */
export type LocaleCollection = Record<string, ILocale>;

export interface ILocaleContext {
  locale: ILocale;
  locales: LocaleCollection;
  strings: Record<string, string>;
  setLocale: (locale: string, forceReload?: boolean) => void;
}

const defaultLocaleContext: ILocaleContext = {
  locale: locales['en-US'],
  locales: locales,
  strings: defaultStrings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setLocale: (locale: string, forceReload?: boolean) => {}
};

export const LocaleContext = createContext<ILocaleContext>(defaultLocaleContext);

export type LocalizationProviderProps = {
  initialLocale: string;
  locales: LocaleCollection;
  localeDataLoader?: (locale: string) => Promise<Record<string, string>>;
  storage?: Storage;
  children: React.ReactNode;
};

export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { children, initialLocale, locales, storage, localeDataLoader } = props;

  useEffect(() => {
    if (storage) {
      const cachedLocale = storage.getItem(LOCALE_CACHE_KEY);
      if (cachedLocale) {
        setLocale(cachedLocale);
      } else {
        storage.setItem(LOCALE_CACHE_KEY, locale.locale);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!locales[initialLocale]) {
    throw new Error('Initial locale assigned is not in locale collection assigned.');
  }

  const [locale, _setLocale] = useState<ILocale>(locales[initialLocale]);
  const [strings, setStrings] = useState<Record<string, string>>({});

  const loadLocaleData = localeDataLoader ?? defaultLocaleDataLoader;

  const setLocale = useCallback(
    async (locale: string, forceReload?: boolean) => {
      const loc = locales[locale];

      if (loc) {
        if (storage) {
          storage.setItem(LOCALE_CACHE_KEY, loc.locale);
        }

        if (forceReload) {
          window.location.reload();
        } else if (loadLocaleData) {
          const localeData = await loadLocaleData(loc.locale);
          setStrings(localeData);
          _setLocale(loc);

          document.documentElement.lang = loc.locale;
          document.documentElement.dir = loc.rtl ? 'rtl' : 'ltr';
        } else {
          throw new Error('Attempted to load a locale without registering a localeLoader handler');
        }
      } else {
        throw new Error(`Attempted to set an unregistered locale "${locale}"`);
      }
    },
    [locales, storage, loadLocaleData]
  );

  useEffect(() => {
    setLocale(initialLocale);
  }, [initialLocale, setLocale]);

  const localeMemo = useMemo<ILocaleContext>(
    () => ({
      locale,
      locales,
      strings,
      setLocale
    }),
    [locale, locales, strings, setLocale]
  );

  return <LocaleContext.Provider value={localeMemo}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): ILocaleContext => useContext(LocaleContext);

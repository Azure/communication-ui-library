// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { defaultLocaleStringsLoader, locales } from './loadLocaleStrings';
import defaultStrings from './translated/en-US.json';

const LOCALE_CACHE_KEY = 'AzureCommunicationUI_Locale';

export interface ILocale {
  locale: string;
  englishName: string;
  displayName: string;
  rtl: boolean;
}

/**
 * Collection of ILocale
 */
export type ILocaleCollection = Record<string, ILocale>;

export type ILocaleKeys = Record<string, string>;

export interface ILocaleContext {
  locale: ILocale;
  locales: ILocaleCollection;
  strings: ILocaleKeys;
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
  locales: ILocaleCollection;
  localeStringsLoader?: (locale: string) => Promise<ILocaleKeys>;
  storage?: Storage;
  children: React.ReactNode;
};

export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { children, initialLocale, locales, storage, localeStringsLoader } = props;

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
  const [strings, setStrings] = useState<ILocaleKeys>({});

  const loadLocaleStrings = localeStringsLoader ?? defaultLocaleStringsLoader;

  const setLocale = useCallback(
    async (locale: string, forceReload?: boolean) => {
      const loc = locales[locale];

      if (loc) {
        if (storage) {
          storage.setItem(LOCALE_CACHE_KEY, loc.locale);
        }

        if (forceReload) {
          window.location.reload();
        } else if (loadLocaleStrings) {
          const localeData = await loadLocaleStrings(loc.locale);
          setStrings(localeData);
          _setLocale(loc);

          document.documentElement.lang = loc.locale;
          document.documentElement.dir = loc.rtl ? 'rtl' : 'ltr';
        } else {
          throw new Error('Attempted to load a locale without registering a localeStringsLoader handler');
        }
      } else {
        throw new Error(`Attempted to set an unregistered locale "${locale}"`);
      }
    },
    [locales, storage, loadLocaleStrings]
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

  return (
    <LocaleContext.Provider value={localeMemo}>
      <body className="ms-Fabric" dir={localeMemo.locale.rtl ? 'rtl' : 'ltr'}>
        {children}
      </body>
    </LocaleContext.Provider>
  );
};

export const useLocale = (): ILocaleContext => useContext(LocaleContext);

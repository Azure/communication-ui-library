// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { loadLocaleData, locales } from './loadLocaleData';
import defaultStrings from './translated/ar.json';

const LOCALE_CACHE_KEY = 'locale';

export interface ILocale {
  locale: string;
  englishName: string;
  displayName: string;
  rtl: boolean;
}

export interface ILocaleContext {
  locale: string;
  locales: ILocale[];
  strings: Record<string, string>;
  setLocale: (locale: string, forceReload?: boolean) => void;
}

const defaultLocaleContext: ILocaleContext = {
  locale: locales[0].locale,
  locales: locales,
  strings: defaultStrings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setLocale: (locale: string, forceReload?: boolean) => {}
};

export const LocaleContext = createContext<ILocaleContext>(defaultLocaleContext);

export type LocalizationProviderProps = {
  initialLocale: string;
  locales: ILocale[];
  storage?: Storage;
  children: React.ReactNode;
};

export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { children, initialLocale, locales, storage } = props;

  useEffect(() => {
    if (storage) {
      const cachedLocale = storage.getItem(LOCALE_CACHE_KEY);
      if (cachedLocale) {
        setLocale(cachedLocale);
      } else {
        storage.setItem(LOCALE_CACHE_KEY, locale);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [locale, _setLocale] = useState(initialLocale);
  const [strings, setStrings] = useState<Record<string, string>>({});

  useEffect(() => {
    const loc = locales.find((l) => l.locale === initialLocale);
    if (loc) {
      document.documentElement.lang = loc.locale;
      console.log('loc.rtl: ' + loc.rtl);
      document.documentElement.dir = loc.rtl ? 'rtl' : 'ltr';
      _setLocale(loc.locale);
    }
    loadLocaleData(initialLocale).then((res) => setStrings(res));
  }, [initialLocale, locales]);

  const setLocale = useCallback(
    async (locale: string, forceReload?: boolean) => {
      const loc = locales.find((l) => l.locale === locale);

      if (loc) {
        if (storage) {
          storage.setItem(LOCALE_CACHE_KEY, loc.locale);
        }

        if (forceReload) {
          window.location.reload();
        } else if (loadLocaleData) {
          const localeData = await loadLocaleData(loc.locale);
          setStrings(localeData);
          _setLocale(loc.locale);

          document.documentElement.lang = loc.locale;
          document.documentElement.dir = loc.rtl ? 'rtl' : 'ltr';
        } else {
          throw new Error('Attempted to load a locale without registering a localeLoader handler');
        }
      } else {
        throw new Error(`Attempted to set an unregistered locale "${locale}"`);
      }
    },
    [locales, storage]
  );

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

export const useLocale = () => useContext(LocaleContext);

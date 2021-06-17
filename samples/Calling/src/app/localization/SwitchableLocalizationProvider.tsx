// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { ILocale, ILocaleKeys, LocalizationProvider, locales } from 'react-components';

const LOCALE_CACHE_KEY = 'AzureCommunicationUI_Locale';

export interface NamedLocale {
  locale: ILocale;
  englishName: string;
  displayName: string;
}

/**
 * Collection of ILocale
 */
export type LocaleCollection = Record<string, NamedLocale>;

export interface ISwitchableLocaleContext {
  locale: ILocale;
  locales: LocaleCollection;
  setLocale: (locale: string, forceReload?: boolean) => void;
}

const defaultLocaleContext: ISwitchableLocaleContext = {
  locale: locales['en-US'].locale,
  locales: locales,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setLocale: (locale: string) => {}
};

export const SwitchableLocaleContext = createContext<ISwitchableLocaleContext>(defaultLocaleContext);

export type SwitchableLocalizationProviderProps = {
  selectedLocale: string;
  locales: LocaleCollection;
  localeStringsLoader?: (locale: string) => Promise<ILocaleKeys>;
  storage?: Storage;
  children: React.ReactNode;
};

export const SwitchableLocalizationProvider = (props: SwitchableLocalizationProviderProps): JSX.Element => {
  const { children, selectedLocale, locales, storage } = props;

  if (!locales[selectedLocale]) {
    throw new Error('Initial locale assigned is not in locale collection assigned.');
  }

  useEffect(() => {
    if (storage) {
      const cachedLocale = storage.getItem(LOCALE_CACHE_KEY);
      if (cachedLocale) {
        setLocale(cachedLocale);
      } else {
        storage.setItem(LOCALE_CACHE_KEY, selectedLocale);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [locale, _setLocale] = useState<ILocale>(locales[selectedLocale].locale);

  const setLocale = useCallback(
    async (locale: string) => {
      const loc = locales[locale];

      if (loc) {
        if (storage) {
          storage.setItem(LOCALE_CACHE_KEY, loc.locale.locale);
        }

        _setLocale(loc.locale);
      } else {
        throw new Error(`Attempted to set an unregistered locale "${locale}"`);
      }
    },
    [locales, storage]
  );

  const localeMemo = useMemo<ISwitchableLocaleContext>(
    () => ({
      locale,
      locales,
      setLocale
    }),
    [locale, locales, setLocale]
  );

  return (
    <SwitchableLocaleContext.Provider value={localeMemo}>
      <LocalizationProvider locale={localeMemo.locale}>{children}</LocalizationProvider>
    </SwitchableLocaleContext.Provider>
  );
};

export const useSwitchableLocale = (): ISwitchableLocaleContext => useContext(SwitchableLocaleContext);

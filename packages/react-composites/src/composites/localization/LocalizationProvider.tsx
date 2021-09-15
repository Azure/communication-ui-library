// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext, useEffect, useState } from 'react';

import { ComponentLocale, LocalizationProvider as ComponentLocalizationProvider } from '@internal/react-components';

import { COMPOSITE_LOCALE_EN_US } from './locales';
import { CallCompositeStrings, ChatCompositeStrings } from '../CallComposite';

/**
 * Data structure for localization
 */
export interface CompositeLocale {
  /** Strings used in composites directly
   *
   * Contrast with {@link CompositeLocale.component}, which contains strings used via the component library.
   */
  strings: CompositeStrings;

  /** Locale information for the pure Components used by Composites. See {@link communication-react#ComponentLocale}. */
  component: ComponentLocale;
}

/**
 * Strings used in the composites directly.
 *
 * These strings are used by the composites directly, instead of by the contained components.
 */
export interface CompositeStrings {
  /**
   * Strings used by {@link CallComposite}.
   */
  call: CallCompositeStrings;
  /**
   * Strings used by {@link ChatComposite}.
   */
  chat: ChatCompositeStrings;
}

/**
 * Context for providing localized strings to components
 */
export const LocaleContext = createContext<CompositeLocale>(COMPOSITE_LOCALE_EN_US);

/**
 * Props to LocalizationProvider
 */
export type LocalizationProviderProps = {
  /**
   * Locale context to provide composite
   *
   * @defaultValue English (US) locale
   */
  locale?: CompositeLocale;
  /** Asynchronous callback to change the locale context */
  localeLoader?: () => Promise<CompositeLocale>;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * Provider to provide localized strings for this library's composites.
 *
 * This provider is internal. Do not export in public API.
 */
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { children, locale, localeLoader } = props;
  const [compositeLocale, setCompositeLocale] = useState<CompositeLocale>(locale ?? COMPOSITE_LOCALE_EN_US);

  useEffect(() => {
    if (localeLoader) {
      const intializeLocale = async (): Promise<void> => {
        const componentLocale = await localeLoader();
        setCompositeLocale(componentLocale);
      };
      intializeLocale();
    }
  }, [localeLoader]);

  return (
    <LocaleContext.Provider value={compositeLocale}>
      <ComponentLocalizationProvider locale={compositeLocale.component}>{children}</ComponentLocalizationProvider>
    </LocaleContext.Provider>
  );
};

/** React hook to access locale */
export const useLocale = (): CompositeLocale => useContext(LocaleContext);

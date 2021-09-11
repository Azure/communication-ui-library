// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext, useEffect, useState } from 'react';

import { ComponentLocale, LocalizationProvider as ComponentLocalizationProvider } from '@internal/react-components';

import { COMPOSITE_LOCALE_EN_US } from './locales';
import { CallCompositeStrings } from '../CallComposite';

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
}

/**
 * Context for providing localized strings to components
 */
export const LocaleContext = createContext<CompositeLocale>(COMPOSITE_LOCALE_EN_US);

/**
 * Props to LocalizationProvider
 */
type InternalLocalizationProviderProps = {
  /** Locale context to provide components */
  locale: CompositeLocale;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * Provider to provide localized strings for this library's composites.
 *
 * This provider is internal. Do not export in public API.
 */
const InternalLocalizationProvider = (props: InternalLocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return (
    <LocaleContext.Provider value={locale}>
      <ComponentLocalizationProvider locale={locale.component}>{children}</ComponentLocalizationProvider>
    </LocaleContext.Provider>
  );
};

/** React hook to access locale */
export const useLocale = (): CompositeLocale => useContext(LocaleContext);

type AsyncLocalizationProviderProps = {
  localeLoader: () => Promise<CompositeLocale>;
  defaultLocale?: CompositeLocale;
  children: React.ReactNode;
};

const AsyncLocalizationProvider = (props: AsyncLocalizationProviderProps): JSX.Element => {
  const { children, defaultLocale, localeLoader } = props;
  const [compositeLocale, setCompositeLocale] = useState<CompositeLocale>(COMPOSITE_LOCALE_EN_US);

  useEffect(() => {
    const intializeLocale = async (): Promise<void> => {
      const compositeLocale = await localeLoader();
      setCompositeLocale(compositeLocale);
    };
    intializeLocale();
  }, [defaultLocale, localeLoader]);

  return <InternalLocalizationProvider locale={compositeLocale}>{children}</InternalLocalizationProvider>;
};

export const LocalizationProvider = (props: {
  locale: CompositeLocale;
  localeLoader?: () => Promise<CompositeLocale>;
  children: React.ReactNode;
}): JSX.Element => {
  const { children, locale, localeLoader } = props;
  if (localeLoader) {
    return AsyncLocalizationProvider({
      defaultLocale: locale,
      localeLoader,
      children
    });
  }
  return InternalLocalizationProvider({ locale, children });
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

import { Locale as ComponentLocale } from '@internal/react-components';

import { COMPOSITE_LOCALE_EN_US } from '../locales';
import { CallCompositeStrings } from '../CallComposite';

/**
 * Data structure for localization
 */
export interface CompositeLocale {
  /** Strings for components */
  strings: CompositeStrings;

  /** Locale information for the pure Components used by Composites. See {@link communication-react#Locale}. */
  component: ComponentLocale;
}

/**
 * Strings used in the composites directly.
 *
 * These strings are used by the composites directly, instead of by the contained components.
 */
export interface CompositeStrings {
  call: CallCompositeStrings;
}

/**
 * Context for providing localized strings to components
 */
export const LocaleContext = createContext<CompositeLocale>(COMPOSITE_LOCALE_EN_US);

/**
 * Props to LocalizationProvider
 */
export type LocalizationProviderProps = {
  /** Locale context to provide components */
  locale: CompositeLocale;
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

/** React hook to access locale */
export const useLocale = (): CompositeLocale => useContext(LocaleContext);

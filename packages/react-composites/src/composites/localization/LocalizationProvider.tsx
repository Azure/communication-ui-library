// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';

import { ComponentLocale, LocalizationProvider as ComponentLocalizationProvider } from '@internal/react-components';

import { COMPOSITE_LOCALE_EN_US } from './locales';
import { CallCompositeStrings } from '../CallComposite';
import { ChatCompositeStrings } from '../ChatComposite';

/**
 * Locale information for all composites exported from this library.
 *
 * @public
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
 *
 * @public
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
 *
 * @private
 */
export const LocaleContext = createContext<CompositeLocale>(COMPOSITE_LOCALE_EN_US);

/**
 * Props to LocalizationProvider
 *
 * @private
 */
export type LocalizationProviderProps = {
  /** Locale context to provide components */
  locale: CompositeLocale;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * Provider to provide localized strings for this library's composites.
 *
 * @private
 */
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return (
    <LocaleContext.Provider value={locale}>
      <ComponentLocalizationProvider locale={locale.component}>{children}</ComponentLocalizationProvider>
    </LocaleContext.Provider>
  );
};

/**
 * @private
 */
export const useLocale = (): CompositeLocale => useContext(LocaleContext);

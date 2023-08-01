// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import type { ComponentLocale, LocalizationProviderProps } from './LocalizationProvider.types';
import { COMPONENT_LOCALE_EN_US } from '../locales';

/**
 * Context for providing localized strings to components exported from this library.
 *
 * @public
 */
export const LocaleContext = createContext<ComponentLocale>(COMPONENT_LOCALE_EN_US);

/**
 * Provider to provide localized strings for this library's react components.
 *
 * @remarks Components will be provided localized strings in English (US) by default if this
 * provider is not used.
 *
 * @public
 */
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

/**
 * React hook to access locale.
 *
 * @public
 */
export const useLocale = (): ComponentLocale => useContext(LocaleContext);

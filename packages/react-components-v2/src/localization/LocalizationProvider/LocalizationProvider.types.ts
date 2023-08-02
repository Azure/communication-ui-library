// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ExampleComponentStrings } from '../../ExampleComponent/ExampleComponent.strings';
import { SendBoxStrings } from '../../SendBox';

/**
 * Strings used by all components exported from this library.
 *
 * @public
 */
export interface ComponentStrings {
  /** Example. To be removed before release. */
  exampleComponent: ExampleComponentStrings;
  sendBox: SendBoxStrings;
}

/**
 * Locale information for all components exported from this library.
 *
 * @public
 */
export interface ComponentLocale {
  /** Strings for components */
  strings: ComponentStrings;
}

/**
 * Props for {@link LocalizationProvider}.
 *
 * @public
 */
export type LocalizationProviderProps = {
  /** Locale context to provide components */
  locale: ComponentLocale;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

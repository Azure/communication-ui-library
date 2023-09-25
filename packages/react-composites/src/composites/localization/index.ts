// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './LocalizationProvider';

import { useLocale } from './LocalizationProvider';

/**
 * @internal
 *
 * Used by storybook INTERNAL stories to provide strings to components from
 * \@internal/react-components that use composite strings, e.g., _ComplianceBanner.
 */
export const _useCompositeLocale = useLocale;

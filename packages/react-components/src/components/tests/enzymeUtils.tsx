// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { LocalizationProvider } from '../../localization/LocalizationProvider';

const initialLocale = 'en-US';
const locales = { 'en-US': { locale: '', englishName: '', displayName: '', rtl: false } };

export const mountWithLocalization = (node: React.ReactElement, strings: Record<string, string>): ShallowWrapper => {
  return mount(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: {
      locales,
      initialLocale,
      localeStringsLoader: async () => {
        return strings;
      }
    }
  });
};

export const shallowWithLocalization = (node: React.ReactElement, strings: Record<string, string>): ShallowWrapper => {
  return shallow(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: {
      locales,
      initialLocale,
      localeStringsLoader: async () => {
        return strings;
      }
    }
  });
};

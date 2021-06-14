// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { LocalizationProvider } from '../../localization/LocalizationProvider';

const strings = import('../../localization/translated/en-US.json');
const initialLocale = 'en-US';
const locales = { 'en-US': { locale: '', englishName: '', displayName: '', rtl: false } };

export const mountWithLocalization = (node: React.ReactNode): ShallowWrapper => {
  return mount(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: {
      locales,
      initialLocale,
      strings
    }
  });
};

export const shallowWithIntl = (node: React.ReactNode): ShallowWrapper => {
  return shallow(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: {
      locales,
      initialLocale,
      strings
    }
  });
};

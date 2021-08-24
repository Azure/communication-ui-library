// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { LocalizationProvider, Locale, ComponentStrings } from '../../localization/LocalizationProvider';
import en_US from '../../localization/locales/en-US/strings.json';
import { PartialDeep } from 'type-fest';

export const mountWithLocalization = (node: React.ReactElement, locale: Locale): ReactWrapper => {
  return mount(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: { locale }
  });
};

export const shallowWithLocalization = (node: React.ReactElement, locale: Locale): ShallowWrapper => {
  return shallow(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: { locale }
  });
};

export const createTestLocale = (testStrings: PartialDeep<ComponentStrings>): Locale => {
  const strings: ComponentStrings = en_US;
  Object.keys(testStrings).forEach((key: string) => {
    strings[key] = { ...strings[key], ...testStrings[key] };
  });
  return { strings };
};

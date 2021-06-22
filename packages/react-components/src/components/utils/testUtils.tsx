// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { LocalizationProvider, Locale } from '../../localization/LocalizationProvider';
import en_US from '../../localization/translated/en-US.json';

export const mountWithLocalization = (node: React.ReactElement, locale: Locale): ShallowWrapper => {
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

export const createTestLocale = (testStrings: any): Locale => {
  return { strings: { ...en_US, ...testStrings } };
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mount, shallow, ShallowWrapper } from 'enzyme';
import { LocalizationProvider, ILocale } from '../../localization/LocalizationProvider';

export const mountWithLocalization = (node: React.ReactElement, locale: ILocale): ShallowWrapper => {
  return mount(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: { locale }
  });
};

export const shallowWithLocalization = (node: React.ReactElement, locale: ILocale): ShallowWrapper => {
  return shallow(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: { locale }
  });
};

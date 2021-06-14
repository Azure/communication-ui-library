// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import renderer from 'react-test-renderer';
import { LocalizationProvider, LocaleCollection } from '../../localization/LocalizationProvider';

const createComponentWithLocalization = (
  children: React.ReactNode,
  props: {
    initialLocale: string;
    locales: LocaleCollection;
    localeStringsLoader?: (locale: string) => Promise<Record<string, string>>;
  }
): any => {
  return renderer.create(<LocalizationProvider {...props}>{children}</LocalizationProvider>);
};

export default createComponentWithLocalization;

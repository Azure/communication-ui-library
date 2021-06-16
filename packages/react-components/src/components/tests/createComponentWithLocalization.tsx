// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import renderer from 'react-test-renderer';
import { LocalizationProvider, ILocaleCollection, ILocaleKeys } from '../../localization/LocalizationProvider';

const createComponentWithLocalization = (
  children: React.ReactNode,
  props: {
    initialLocale: string;
    locales: ILocaleCollection;
    localeStringsLoader?: (locale: string) => Promise<ILocaleKeys>;
  }
): any => {
  return renderer.create(<LocalizationProvider {...props}>{children}</LocalizationProvider>);
};

export default createComponentWithLocalization;

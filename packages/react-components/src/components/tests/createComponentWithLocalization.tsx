// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import renderer from 'react-test-renderer';
import { LocalizationProvider, ILocale } from '../../localization/LocalizationProvider';

const createComponentWithLocalization = (children: React.ReactNode, props: { locale: ILocale }): any => {
  return renderer.create(<LocalizationProvider {...props}>{children}</LocalizationProvider>);
};

export default createComponentWithLocalization;

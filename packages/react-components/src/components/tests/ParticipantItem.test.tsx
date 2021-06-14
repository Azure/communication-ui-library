// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import createComponentWithLocalization from './createComponentWithLocalization';
import { ParticipantItem } from '../ParticipantItem';

test('ParticipantItem snapshot in en-US', async () => {
  const component = createComponentWithLocalization(<ParticipantItem displayName="Mark" me={true} />, {
    initialLocale: 'en-US',
    locales: { 'en-US': { locale: '', englishName: '', displayName: '', rtl: false } }
  });

  expect(component).toMatchSnapshot();
});

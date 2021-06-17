// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import createComponentWithLocalization from './createComponentWithLocalization';
import { ParticipantItem } from '../ParticipantItem';
import englishStrings from '../../localization/translated/en-US.json';

test('ParticipantItem snapshot in en-US', async () => {
  const component = createComponentWithLocalization(<ParticipantItem displayName="Mark" me={true} />, {
    locale: { locale: 'en-US', rtl: false, strings: englishStrings }
  });

  expect(component).toMatchSnapshot();
});

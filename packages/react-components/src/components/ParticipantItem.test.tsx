// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ParticipantItem } from './ParticipantItem';
import { renderWithLocalization, createTestLocale } from './utils/testUtils';

describe('ParticipantItem should work with localization', () => {
  test('Should use localized string', async () => {
    const testLocale = createTestLocale({ participantItem: { isMeText: Math.random().toString() } });
    const { container } = renderWithLocalization(<ParticipantItem displayName="Mark" me={true} />, testLocale);
    expect(container.textContent).toContain(testLocale.strings.participantItem.isMeText);
  });
});

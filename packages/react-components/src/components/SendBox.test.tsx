// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { SendBox } from './SendBox';
import { renderWithLocalization, createTestLocale } from './utils/testUtils';
import { screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

describe('SendBox strings should be localizable and overridable', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        sendboxsend: <></>
      }
    });
  });
  test('Should localize placeholder text', async () => {
    const testLocale = createTestLocale({ sendBox: { placeholderText: Math.random().toString() } });
    renderWithLocalization(<SendBox />, testLocale);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).placeholder).toBe(
      testLocale.strings.sendBox.placeholderText
    );
  });
  test('Should override button label with `strings` prop', async () => {
    const testLocale = createTestLocale({ sendBox: { placeholderText: Math.random().toString() } });
    const sendBoxStrings = { placeholderText: Math.random().toString() };
    renderWithLocalization(<SendBox strings={sendBoxStrings} />, testLocale);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).placeholder).toBe(sendBoxStrings.placeholderText);
  });
});

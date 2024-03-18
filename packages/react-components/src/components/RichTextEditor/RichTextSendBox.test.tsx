// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { RichTextSendBox } from './RichTextSendBox';
import { renderWithLocalization, createTestLocale } from '../utils/testUtils';

/* @conditional-compile-remove(rich-text-editor) */
describe('RichTextSendBox should work with localization', () => {
  test('Should use localized string', async () => {
    const testLocale = createTestLocale({ richTextSendBox: { placeholderText: Math.random().toString() } });
    const { container } = renderWithLocalization(
      <RichTextSendBox
        onSendMessage={() => {
          return Promise.resolve();
        }}
      />,
      testLocale
    );
    expect(container.textContent).toContain(testLocale.strings.richTextSendBox.placeholderText);
  });
});

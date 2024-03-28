// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { RichTextSendBox } from './RichTextSendBox';
/* @conditional-compile-remove(rich-text-editor) */
import { renderWithLocalization, createTestLocale } from '../utils/testUtils';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { registerIcons } from '@fluentui/react';

const icons: {
  [key: string]: string | JSX.Element;
} = {
  sendboxsend: <></>,
  richtextboldbuttonicon: <></>,
  richtextitalicbuttonicon: <></>,
  richtextunderlinebuttonicon: <></>,
  richtextbulletlistbuttonicon: <></>,
  richtextnumberlistbuttonicon: <></>,
  richtextindentdecreasebuttonicon: <></>,
  richtextindentincreasebuttonicon: <></>,
  richtextdividericon: <></>,
  richtexteditorbuttonicon: <></>,
  richtextinserttableregularicon: <></>,
  richtextinserttablefilledicon: <></>
};

describe('RichTextSendBox should return text correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: icons
    });
  });
  test('HTML string should be correct when send button is clicked', async () => {
    let changedValue = '';
    render(
      <RichTextSendBox
        onSendMessage={async (message: string): Promise<void> => {
          changedValue = message ?? '';
          return Promise.resolve();
        }}
      />
    );
    // Find the input field
    const editorDiv = screen.queryByTestId('rooster-rich-text-editor');
    // fix for an issue when contentEditable is not set to RoosterJS for tests
    editorDiv?.setAttribute('contentEditable', 'true');
    if (editorDiv === null) {
      fail('Editor div not found');
    }
    await userEvent.click(editorDiv);
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard('Test');
    });
    // Find and click the send button
    const sendButton = await screen.findByRole('button', {
      name: 'Send message'
    });
    fireEvent.click(sendButton);
    // Check the updated value is correct
    const result = '<div style="background-color: transparent;">Test<br></div>';
    expect(changedValue).toEqual(result);
  });
});

/* @conditional-compile-remove(rich-text-editor) */
describe('RichTextSendBox should work with localization', () => {
  beforeAll(() => {
    registerIcons({
      icons: icons
    });
  });
  test('Should localize placeholder', async () => {
    const testLocale = createTestLocale({
      richTextSendBox: { placeholderText: Math.random().toString() }
    });
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

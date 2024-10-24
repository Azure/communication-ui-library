// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { RichTextSendBox } from './RichTextSendBox';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('RichTextSendBox should only call onSendMessage when there is content and it is not disabled', () => {
  test('onSendMessage should not be called when message is empty', async () => {
    let called = false;
    render(
      <RichTextSendBox
        onSendMessage={async (): Promise<void> => {
          called = true;
          return Promise.resolve();
        }}
      />
    );
    // Find and click the send button
    const sendButton = await screen.findByRole('button', {
      name: 'Send message'
    });
    fireEvent.click(sendButton);
    // Check that onSendMessage was not called
    expect(called).toBeFalsy();
  });
  test('onSendMessage should not be called when disabled', async () => {
    let called = false;
    render(
      <RichTextSendBox
        disabled={true}
        onSendMessage={async (): Promise<void> => {
          called = true;
          return Promise.resolve();
        }}
      />
    );
    // Find the input field
    const editorDiv = screen.queryByTestId('rooster-rich-text-editor');
    // fix for an issue when contentEditable is not set to RoosterJS for tests
    editorDiv?.setAttribute('contentEditable', 'true');
    if (editorDiv === null) {
      throw new Error('Editor div not found');
    }
    // Find and click the send button
    const sendButton = await screen.findByRole('button', {
      name: 'Send message'
    });
    fireEvent.click(sendButton);
    // Check that onSendMessage was not called
    expect(called).toBeFalsy();
  });
});

describe('RichTextSendBox should return text correctly', () => {
  test.skip('HTML string should be correct when send button is clicked', async () => {
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
      throw new Error('Editor div not found');
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
    const result = '<div>Test</div>';
    expect(changedValue).toEqual(result);
  });
});

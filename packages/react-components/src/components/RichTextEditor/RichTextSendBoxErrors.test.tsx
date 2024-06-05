// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { RichTextSendBoxErrors } from './RichTextSendBoxErrors';
import { act, render, screen } from '@testing-library/react';
import { registerIcons } from '@fluentui/react';

jest.useFakeTimers();
describe('RichTextSendBoxErrors should be shown correctly', () => {
  beforeAll(() => {
    registerIcons({
      icons: {
        info: <></>
      }
    });
  });
  test('MessageBar shouldn`t be shown if there are no errors', async () => {
    render(<RichTextSendBoxErrors />);
    const messageBar = screen.queryByTestId('send-box-message-bar');
    expect(messageBar).toBeNull();
  });

  test('MessageBar should show system error', async () => {
    const text = 'Test system message';
    render(<RichTextSendBoxErrors systemMessage={text} />);
    const sendBoxErrorComponent = await screen.findByText(text);

    expect(sendBoxErrorComponent).not.toBeNull();
  });

  /* @conditional-compile-remove(file-sharing-acs) */
  test('MessageBar should show attachment uploads pending error', async () => {
    const text = 'Test attachment uploads pending error';
    render(<RichTextSendBoxErrors attachmentUploadsPendingError={{ message: text, timestamp: Date.now() }} />);
    const sendBoxErrorComponent = await screen.findByText(text);

    expect(sendBoxErrorComponent).not.toBeNull();
  });

  /* @conditional-compile-remove(file-sharing-acs) */
  test('MessageBar should show attachment uploads error', async () => {
    const text = 'Test attachment uploads error';
    render(<RichTextSendBoxErrors attachmentProgressError={{ message: text, timestamp: Date.now() }} />);
    const sendBoxErrorComponent = await screen.findByText(text);

    expect(sendBoxErrorComponent).not.toBeNull();
  });

  test('MessageBar should show text too long message', async () => {
    const text = 'Test textTooLongMessage message';
    render(<RichTextSendBoxErrors textTooLongMessage={text} />);
    const sendBoxErrorComponent = await screen.findByText(text);

    expect(sendBoxErrorComponent).not.toBeNull();
  });

  test('MessageBar should hide textTooLongMessage after 10 sec and show system error', async () => {
    const systemMessage = 'Test system message';
    const textTooLongMessage = 'Test textTooLongMessage message';
    render(<RichTextSendBoxErrors systemMessage={systemMessage} textTooLongMessage={textTooLongMessage} />);
    const textTooLongMessageComponent = await screen.findByText(textTooLongMessage);
    const systemMessageComponent = screen.queryByText(systemMessage);
    expect(systemMessageComponent).toBeNull();
    expect(textTooLongMessageComponent).not.toBeNull();

    // Need to be used inside act as the functionality inside causes re-render
    act(() => {
      // Fast-forward timer to hide the textTooLongMessage
      jest.advanceTimersByTime(10 * 1000);
    });

    const systemMessageComponent2 = await screen.findByText(systemMessage);
    expect(systemMessageComponent2).not.toBeNull();
    const textTooLongMessageComponent2 = screen.queryByText(textTooLongMessage);
    expect(textTooLongMessageComponent2).toBeNull();
  });
});

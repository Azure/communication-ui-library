// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { RTESendBoxErrors } from './RTESendBoxErrors';
import { render, screen } from '@testing-library/react';

describe('RTESendBoxErrors should be shown correctly', () => {
  test('MessageBar shouldn`t be shown if there are no errors', async () => {
    render(<RTESendBoxErrors />);
    const messageBar = screen.queryByTestId('send-box-message-bar');
    expect(messageBar).toBeNull();
  });

  test('MessageBar should show system error', async () => {
    const text = 'Test system message';
    render(<RTESendBoxErrors systemMessage={text} />);
    const sendBoxErrorComponent = screen.findByText(text);

    expect(sendBoxErrorComponent).toBeDefined();
  });

  test('MessageBar should show file uploads pending error', async () => {
    const text = 'Test file uploads pending error';
    render(<RTESendBoxErrors fileUploadsPendingError={{ message: text, timestamp: Date.now() }} />);
    const sendBoxErrorComponent = screen.findByText(text);

    expect(sendBoxErrorComponent).toBeDefined();
  });

  test('MessageBar should show file uploads error', async () => {
    const text = 'Test file uploads error';
    render(<RTESendBoxErrors fileUploadError={{ message: text, timestamp: Date.now() }} />);
    const sendBoxErrorComponent = screen.findByText(text);

    expect(sendBoxErrorComponent).toBeDefined();
  });

  test('MessageBar should show text too long message', async () => {
    const text = 'Test textTooLongMessage message';
    render(<RTESendBoxErrors textTooLongMessage={text} />);
    const sendBoxErrorComponent = screen.findByText(text);

    expect(sendBoxErrorComponent).toBeDefined();
  });
});

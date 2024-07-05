// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatAdapter, ChatAdapterState } from './adapter/ChatAdapter';
import { registerIcons } from '@fluentui/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { COMPOSITE_LOCALE_ZH_TW } from '../localization/locales/zh-TW/CompositeLocale';
import { ChatComposite } from './ChatComposite';
import React from 'react';

function createMockChatAdapter(): ChatAdapter {
  const chatAdapter = {} as ChatAdapter;
  chatAdapter.onStateChange = jest.fn();
  chatAdapter.offStateChange = jest.fn();
  chatAdapter.fetchInitialData = jest.fn();
  chatAdapter.loadPreviousChatMessages = jest.fn();
  chatAdapter.getState = jest.fn(
    (): ChatAdapterState => ({
      userId: { kind: 'communicationUser', communicationUserId: 'test' },
      displayName: 'test',
      thread: {
        chatMessages: {},
        participants: {},
        threadId: 'test',
        readReceipts: [],
        typingIndicators: [],
        latestReadTime: new Date()
      },
      latestErrors: {},
      error: undefined
    })
  );
  return chatAdapter;
}

// Mock the richTextSendBoxWrapper component as it's lazy loaded in ChatComposite
function MockedRichTextSendBoxWrapper(): JSX.Element {
  return <div id="richTextSendBoxWrapper">Mocked RichTextSendboxWrapper</div>;
}

jest.mock('../common/RichTextSendBoxWrapper', () => {
  return {
    RichTextSendBoxWrapper: MockedRichTextSendBoxWrapper
  };
});

describe('ChatAdapter', () => {
  beforeEach(() => {
    // Register icons used in ChatComposite to avoid warnings
    registerIcons({
      icons: {
        chevrondown: <></>
      }
    });
  });

  test('Chat Composite should show richTextSendBox if it is enabled', async () => {
    const mockBaseCompositeProps = {
      fluentTheme: {},
      icons: {},
      locale: COMPOSITE_LOCALE_ZH_TW,
      rtl: true,
      onFetchAvatarPersonaData: jest.fn(),
      options: {
        richTextEditor: true
      }
    };

    const mockChatAdapter = createMockChatAdapter();

    render(<ChatComposite adapter={mockChatAdapter} {...mockBaseCompositeProps} />);
    const textToMatch = await screen.findByText(/Mocked RichTextSendboxWrapper/);
    expect(textToMatch).toBeInTheDocument();
  });
});

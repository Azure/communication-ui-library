// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { ChatAdapter, ChatAdapterState } from './adapter/ChatAdapter';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { registerIcons } from '@fluentui/react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { render, screen } from '@testing-library/react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import '@testing-library/jest-dom';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { COMPOSITE_LOCALE_ZH_TW } from '../localization/locales/zh-TW/CompositeLocale';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { ChatComposite, ChatCompositeProps } from './ChatComposite';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import React from 'react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { RichTextSendBoxProps } from '@internal/react-components';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { RichTextSendBoxWrapper } from '../common/RichTextSendBoxWrapper';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { removeImageTags } from '@internal/acs-ui-common';
// Mock the richTextSendBoxWrapper component as it's lazy loaded in ChatComposite
/* @conditional-compile-remove(rich-text-editor-composite-support) */
function MockedRichTextSendBoxWrapperComponent(): JSX.Element {
  return <div data-testid="rich-text-editor-test">Mocked RichTextSendboxWrapper</div>;
}
/* @conditional-compile-remove(rich-text-editor-composite-support) */
jest.mock('../common/RichTextSendBoxWrapper');
/* @conditional-compile-remove(rich-text-editor-composite-support) */
const mockedRichTextSendBoxWrapper = jest.mocked(RichTextSendBoxWrapper);

/* @conditional-compile-remove(rich-text-editor-composite-support) */
describe('ChatComposite', () => {
  const createMockChatAdapter = (): ChatAdapter => {
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
        latestErrors: {}
      })
    );
    return chatAdapter;
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    // Register icons used in ChatComposite to avoid warnings
    registerIcons({
      icons: {
        chevrondown: <></>
      }
    });

    mockedRichTextSendBoxWrapper.mockImplementation(MockedRichTextSendBoxWrapperComponent);
  });

  test('Chat Composite should show RichTextSendBoxWrapper if it is enabled', async () => {
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
    const mockSendBox = await screen.findByTestId('rich-text-editor-test');
    expect(mockSendBox).toBeVisible();
  });

  test('Chat Composite should not show RichTextSendBoxWrapper if it is not enabled', async () => {
    const mockBaseCompositeProps = {
      fluentTheme: {},
      icons: {},
      locale: COMPOSITE_LOCALE_ZH_TW,
      rtl: true,
      onFetchAvatarPersonaData: jest.fn(),
      options: {
        richTextEditor: false
      }
    };

    const mockChatAdapter = createMockChatAdapter();

    render(<ChatComposite adapter={mockChatAdapter} {...mockBaseCompositeProps} />);
    expect(screen.queryByTestId('rich-text-editor-test')).toBeNull();
  });
});

/* @conditional-compile-remove(rich-text-editor-composite-support) */
describe('ChatComposite - text only mode', () => {
  const createMockChatAdapter = (textOnlyChat: boolean): ChatAdapter => {
    const chatAdapter = {} as ChatAdapter;
    chatAdapter.onStateChange = jest.fn();
    chatAdapter.offStateChange = jest.fn();
    chatAdapter.fetchInitialData = jest.fn();
    chatAdapter.loadPreviousChatMessages = jest.fn();
    chatAdapter.getState = jest.fn(
      (): ChatAdapterState => ({
        //Text only mode is available for Teams meetings only
        userId: { kind: 'microsoftTeamsUser', microsoftTeamsUserId: 'test' },
        displayName: 'test',
        thread: {
          chatMessages: {},
          participants: {},
          threadId: 'test',
          readReceipts: [],
          typingIndicators: [],
          latestReadTime: new Date(),
          properties: {
            messagingPolicy: { textOnlyChat: textOnlyChat },
            createdBy: { kind: 'microsoftTeamsUser', microsoftTeamsUserId: 'test' }
          }
        },
        latestErrors: {}
      })
    );
    return chatAdapter;
  };

  const mockBaseCompositeProps = (adapter: ChatAdapter, richTextEditor: boolean): ChatCompositeProps => {
    return {
      adapter: adapter,
      fluentTheme: {},
      icons: {},
      locale: COMPOSITE_LOCALE_ZH_TW,
      rtl: true,
      onFetchAvatarPersonaData: jest.fn(),
      options: {
        richTextEditor: richTextEditor,
        attachmentOptions: {
          uploadOptions: {
            handleAttachmentSelection: () => {}
          }
        }
      }
    };
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    // Register icons used in ChatComposite to avoid warnings
    registerIcons({
      icons: {
        chevrondown: <></>
      }
    });
    mockedRichTextSendBoxWrapper.mockImplementation(MockedRichTextSendBoxWrapperComponent);
  });

  test('Chat Composite should set onPaste callback when text only mode is on', async () => {
    let onPaste: ((event: { content: DocumentFragment }) => void) | undefined = undefined;
    expect.assertions(2);
    function Wrapper(props: RichTextSendBoxProps): JSX.Element {
      onPaste = props.onPaste;
      return <MockedRichTextSendBoxWrapperComponent />;
    }
    mockedRichTextSendBoxWrapper.mockImplementation(Wrapper);
    const mockChatAdapter = createMockChatAdapter(true);
    render(<ChatComposite {...mockBaseCompositeProps(mockChatAdapter, true)} />);
    await screen.findByTestId('rich-text-editor-test');
    expect(onPaste).toBeDefined();
    if (onPaste !== undefined) {
      const onPasteFunction = onPaste as (event: { content: DocumentFragment }) => void;
      expect(onPasteFunction).toBe(removeImageTags);
    } else {
      throw new Error('onPaste is undefined');
    }
  });

  test('Chat Composite with rich text send box should not show attachments button when text only mode is on', async () => {
    const mockChatAdapter = createMockChatAdapter(true);
    render(<ChatComposite {...mockBaseCompositeProps(mockChatAdapter, true)} />);
    expect(screen.queryByTestId('attachment-upload-button')).toBeNull();
  });

  test('Chat Composite with plain text send box should not show attachments button when text only mode is on', async () => {
    const mockChatAdapter = createMockChatAdapter(true);
    render(<ChatComposite {...mockBaseCompositeProps(mockChatAdapter, false)} />);
    expect(screen.queryByTestId('attachment-upload-button')).toBeNull();
  });

  test('Chat Composite should set onPaste callback to undefined when text only mode is off', async () => {
    let onPaste: ((event: { content: DocumentFragment }) => void) | undefined = undefined;
    expect.assertions(1);
    function Wrapper(props: RichTextSendBoxProps): JSX.Element {
      onPaste = props.onPaste;
      return <MockedRichTextSendBoxWrapperComponent />;
    }
    mockedRichTextSendBoxWrapper.mockImplementation(Wrapper);
    const mockChatAdapter = createMockChatAdapter(false);
    render(<ChatComposite {...mockBaseCompositeProps(mockChatAdapter, true)} />);
    await screen.findByTestId('rich-text-editor-test');
    expect(onPaste).toBeUndefined();
  });

  test('Chat Composite with rich text send box should show attachments button when text only mode is off', async () => {
    const mockChatAdapter = createMockChatAdapter(false);
    render(<ChatComposite {...mockBaseCompositeProps(mockChatAdapter, true)} />);
    const attachmentsButton = await screen.findByTestId('attachment-upload-button');
    expect(attachmentsButton).toBeDefined();
  });

  test('Chat Composite with plain text send box should show attachments button when text only mode is off', async () => {
    const mockChatAdapter = createMockChatAdapter(false);
    render(<ChatComposite {...mockBaseCompositeProps(mockChatAdapter, false)} />);
    const attachmentsButton = await screen.findByTestId('attachment-upload-button');
    expect(attachmentsButton).toBeDefined();
  });
});

// Remove when rich-text-editor-composite-support is GA
describe('Empty Test', () => {
  test.skip('Empty test for Conditional Compile case where no tests are included', (done) => done());
});

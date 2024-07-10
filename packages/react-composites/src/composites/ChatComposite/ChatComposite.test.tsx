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
import { ChatComposite } from './ChatComposite';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import React from 'react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { RichTextSendBoxProps } from '@internal/react-components';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { RichTextSendBoxWrapper } from '../common/RichTextSendBoxWrapper';

// Mock the richTextSendBoxWrapper component as it's lazy loaded in ChatComposite
/* @conditional-compile-remove(rich-text-editor-composite-support) */
function MockedRichTextSendBoxWrapperComponent(): JSX.Element {
  return <div data-testid="rich-text-editor-test">Mocked RichTextSendboxWrapper</div>;
}
jest.mock('../common/RichTextSendBoxWrapper');
const mockedRichTextSendBoxWrapper = jest.mocked(RichTextSendBoxWrapper);

/* @conditional-compile-remove(rich-text-editor-composite-support) */
describe('ChatComposite', () => {
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
        latestErrors: {}
      })
    );
    return chatAdapter;
  }

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
  function createMockChatAdapter(textOnlyChat: boolean): ChatAdapter {
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
          latestReadTime: new Date(),
          properties: { messagingPolicy: { textOnlyChat: textOnlyChat } }
        },
        latestErrors: {}
      })
    );
    return chatAdapter;
  }

  const mockBaseCompositeProps = {
    fluentTheme: {},
    icons: {},
    locale: COMPOSITE_LOCALE_ZH_TW,
    rtl: true,
    onFetchAvatarPersonaData: jest.fn(),
    options: {
      richTextEditor: true,
      attachmentOptions: {
        uploadOptions: {
          handleAttachmentSelection: () => {}
        }
      }
    }
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
    render(<ChatComposite adapter={mockChatAdapter} {...mockBaseCompositeProps} />);
    await screen.findByTestId('rich-text-editor-test');
    expect(onPaste).toBeDefined();
    if (onPaste !== undefined) {
      const onPasteFunction = onPaste as (event: { content: DocumentFragment }) => void;
      expect(onPasteFunction.toString()).toBe(removeImageTags.toString());
    } else {
      fail('onPaste is undefined');
    }
  });

  test('Chat Composite should not show attachments button when text only mode is on', async () => {
    const mockChatAdapter = createMockChatAdapter(true);
    render(<ChatComposite adapter={mockChatAdapter} {...mockBaseCompositeProps} />);
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
    render(<ChatComposite adapter={mockChatAdapter} {...mockBaseCompositeProps} />);
    await screen.findByTestId('rich-text-editor-test');
    expect(onPaste).toBeUndefined();
  });

  test('Chat Composite should show attachments button when text only mode is off', async () => {
    const mockChatAdapter = createMockChatAdapter(false);
    render(<ChatComposite adapter={mockChatAdapter} {...mockBaseCompositeProps} />);
    const attachmentsButton = await screen.findByTestId('attachment-upload-button');
    expect(attachmentsButton).toBeDefined();
  });
});

// Remove when rich-text-editor-composite-support is GA
describe('Empty Test', () => {
  test.skip('Empty test for Conditional Compile case where no tests are included', (done) => done());
});

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const removeImageTags = (event: { content: DocumentFragment }): void => {
  event.content.querySelectorAll('img').forEach((image) => {
    // If the image is the only child of its parent, remove all the parents of this img element.
    let parentNode: HTMLElement | null = image.parentElement;
    let currentNode: HTMLElement = image;
    while (parentNode?.childNodes.length === 1) {
      currentNode = parentNode;
      parentNode = parentNode.parentElement;
    }
    currentNode?.remove();
  });
};

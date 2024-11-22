// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import {
  ChatMessageComponentAsRichTextEditBox,
  ChatMessageComponentAsRichTextEditBoxProps
} from './ChatMessageComponentAsRichTextEditBox';
import { COMPONENT_LOCALE_EN_US } from '../../../localization/locales';
import userEvent from '@testing-library/user-event';
import { modifyInlineImagesInContentString } from '../../utils/SendBoxUtils';

describe('ChatMessageComponentAsRichTextEditBox tests', () => {
  const onCancelMock = jest.fn();
  const onSubmitMock = jest.fn();
  const text = 'Hello World!';
  const htmlContent = `<div>${text}</div>`;
  const messageId = '1';

  const localeStrings = COMPONENT_LOCALE_EN_US.strings;

  const props: ChatMessageComponentAsRichTextEditBoxProps = {
    onCancel: onCancelMock,
    onSubmit: onSubmitMock,
    strings: localeStrings.messageThread,
    message: {
      content: htmlContent,
      messageId: messageId,
      attached: true,
      messageType: 'chat',
      contentType: 'html',
      createdOn: new Date()
    }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component correctly', () => {
    render(<ChatMessageComponentAsRichTextEditBox {...props} />);

    const cancelButton = screen.queryByTestId('chat-message-rich-text-edit-box-cancel-button');
    const submitButton = screen.queryByTestId('chat-message-rich-text-edit-box-submit-button');
    const formatButton = screen.queryByTestId('rich-text-input-box-format-button');
    const contentComponent = screen.queryByText(text);

    expect(cancelButton).not.toBeNull();
    expect(submitButton).not.toBeNull();
    expect(formatButton).not.toBeNull();
    expect(contentComponent).not.toBeNull();
  });

  test('calls onCancel when cancel button is clicked', async () => {
    render(<ChatMessageComponentAsRichTextEditBox {...props} />);

    const cancelButton = screen.queryByTestId('chat-message-rich-text-edit-box-cancel-button');
    if (cancelButton === null) {
      throw new Error('Cancel button not found');
    }
    await userEvent.click(cancelButton);

    expect(onCancelMock).toHaveBeenCalledWith(messageId);
  });

  test('calls onSubmit when submit button is clicked', async () => {
    render(<ChatMessageComponentAsRichTextEditBox {...props} />);
    const editorDiv = screen.queryByTestId('rooster-rich-text-editor');
    // fix for an issue when contentEditable is not set to RoosterJS for tests
    editorDiv?.setAttribute('contentEditable', 'true');
    if (editorDiv === null) {
      throw new Error('Editor div not found');
    }
    await userEvent.click(editorDiv);
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(' Test');
    });

    const submitButton = screen.queryByTestId('chat-message-rich-text-edit-box-submit-button');
    if (submitButton === null) {
      throw new Error('Submit button not found');
    }
    fireEvent.click(submitButton);
    await modifyInlineImagesInContentString('<div>Hello World! Test</div>', []);

    expect(onSubmitMock).toHaveBeenCalledWith(
      '<div>Hello World! Test</div>',
      // in beta, attachment metadata is undefined
      // because there is no attachment associated with this message
      // in stable, attachment metadata field do not exist
      /* @conditional-compile-remove(file-sharing-acs) */ []
    );
  });
});

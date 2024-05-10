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
import { registerIcons } from '@fluentui/react';

const icons: {
  [key: string]: string | JSX.Element;
} = {
  editboxsubmit: <></>,
  editboxcancel: <></>,
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

describe('ChatMessageComponentAsRichTextEditBox tests', () => {
  beforeAll(() => {
    registerIcons({
      icons: icons
    });
  });

  const onCancelMock = jest.fn();
  const onSubmitMock = jest.fn();
  const text = 'Hello World!';
  const htmlContent = `<div style="background-color: transparent;">${text}</div>`;
  const messageId = '1';

  const localeStrings = COMPONENT_LOCALE_EN_US.strings;
  const cancelButtonTitle = localeStrings.messageThread.editBoxCancelButton;
  const submitButtonTitle = localeStrings.messageThread.editBoxSubmitButton;

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

    const cancelButton = screen.queryByTestId(cancelButtonTitle);
    const submitButton = screen.queryByTestId(submitButtonTitle);
    const formatButton = screen.queryByTestId('rich-text-input-box-format-button');
    const contentComponent = screen.queryByText(text);

    expect(cancelButton).not.toBeNull();
    expect(submitButton).not.toBeNull();
    expect(formatButton).not.toBeNull();
    expect(contentComponent).not.toBeNull();
  });

  test('calls onCancel when cancel button is clicked', async () => {
    render(<ChatMessageComponentAsRichTextEditBox {...props} />);

    const cancelButton = screen.queryByTestId(cancelButtonTitle);
    if (cancelButton === null) {
      fail('Cancel button not found');
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
      fail('Editor div not found');
    }
    await userEvent.click(editorDiv);
    await waitFor(async () => {
      // Type into the input field
      await userEvent.keyboard(' Test');
    });

    const submitButton = screen.queryByTestId(submitButtonTitle);
    if (submitButton === null) {
      fail('Submit button not found');
    }
    fireEvent.click(submitButton);

    expect(onSubmitMock).toHaveBeenCalledWith(
      '<div style="background-color: transparent;">Hello World! Test</div>',
      // in beta, attachment metadata is undefined
      // because there is no attachment associated with this message
      // in stable, attachment metadata field do not exist
      /* @conditional-compile-remove(attachment-upload) */ []
    );
  });
});

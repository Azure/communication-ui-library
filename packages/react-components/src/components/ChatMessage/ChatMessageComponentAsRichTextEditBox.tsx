// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles, Stack } from '@fluentui/react';
import { ChatMyMessage } from '@fluentui-contrib/react-chat';
import { mergeClasses } from '@fluentui/react-components';
import { _formatString } from '@internal/acs-ui-common';
import { useTheme } from '../../theming/FluentThemeProvider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { editBoxWidthStyles, richTextEditBoxActionButtonIcon } from '../styles/EditBox.styles';
import { InputBoxButton } from '../InputBoxButton';
import { MessageThreadStrings } from '../MessageThread';
import { useChatMyMessageStyles } from '../styles/MessageThread.styles';
import { ChatMessage } from '../../types';
import { _AttachmentUploadCards } from '../AttachmentUploadCards';
/* @conditional-compile-remove(file-sharing) */
import { AttachmentMetadata } from '../AttachmentDownloadCards';
import { useChatMessageRichTextEditContainerStyles } from '../styles/ChatMessageComponent.styles';
import { MAXIMUM_LENGTH_OF_MESSAGE } from '../utils/SendBoxUtils';
import { getMessageState, onRenderCancelIcon, onRenderSubmitIcon } from '../utils/ChatMessageComponentAsEditBoxUtils';
/* @conditional-compile-remove(file-sharing) */
import { getMessageAttachedFilesMetadata } from '../utils/ChatMessageComponentAsEditBoxUtils';
import { RichTextEditorComponentRef } from '../RichTextEditor/RichTextEditor';
import { RichTextInputBoxComponent } from '../RichTextEditor/RichTextInputBoxComponent';
import { editBoxRichTextEditorStyle, richTextActionButtonsStyle } from '../styles/RichTextEditor.styles';
import { RichTextSendBoxErrors } from '../RichTextEditor/RichTextSendBoxErrors';
import { useLocale } from '../../localization';

/** @beta */
export type ChatMessageComponentAsRichTextEditBoxProps = {
  onCancel?: (messageId: string) => void;
  onSubmit: (
    text: string,
    metadata?: Record<string, string>,
    options?: {
      /* @conditional-compile-remove(file-sharing) */
      attachmentMetadata?: AttachmentMetadata[];
    }
  ) => void;
  message: ChatMessage;
  strings: MessageThreadStrings;
};

/**
 * @beta
 */
export const ChatMessageComponentAsRichTextEditBox = (
  props: ChatMessageComponentAsRichTextEditBoxProps
): JSX.Element => {
  const { onCancel, onSubmit, strings, message } = props;

  const [textValue, setTextValue] = useState<string>(message.content || '');
  /* @conditional-compile-remove(file-sharing) */
  const [attachmentMetadata, _] = React.useState(getMessageAttachedFilesMetadata(message));
  const editTextFieldRef = React.useRef<RichTextEditorComponentRef>(null);
  const theme = useTheme();
  const messageState = getMessageState(
    textValue,
    /* @conditional-compile-remove(file-sharing) */ attachmentMetadata ?? []
  );
  const submitEnabled = messageState === 'OK';

  const editContainerStyles = useChatMessageRichTextEditContainerStyles();
  const chatMyMessageStyles = useChatMyMessageStyles();
  const locale = useLocale().strings;

  // TODO: Check if the focus is needed, if so use `focusOnInit` prop
  // for Rooster component instead as this sets focus too early
  useEffect(() => {
    editTextFieldRef.current?.focus();
  }, []);

  const setText = (newValue?: string): void => {
    setTextValue(newValue ?? '');
  };

  const textTooLongMessage =
    messageState === 'too long'
      ? _formatString(strings.editBoxTextLimit, { limitNumber: `${MAXIMUM_LENGTH_OF_MESSAGE}` })
      : undefined;

  const iconClassName = useCallback(
    (isHover: boolean) => {
      const color = isHover ? theme.palette.accent : theme.palette.neutralSecondary;
      return mergeStyles(richTextEditBoxActionButtonIcon, { color });
    },
    [theme.palette.accent, theme.palette.neutralSecondary]
  );

  const onRenderThemedCancelIcon = useCallback(
    (isHover: boolean) => {
      return onRenderCancelIcon(iconClassName(isHover));
    },
    [iconClassName]
  );

  const onRenderThemedSubmitIcon = useCallback(
    (isHover: boolean) => {
      return onRenderSubmitIcon(iconClassName(isHover));
    },
    [iconClassName]
  );

  const actionButtons = useMemo(() => {
    return (
      <Stack horizontal>
        <InputBoxButton
          className={richTextActionButtonsStyle}
          ariaLabel={strings.editBoxCancelButton}
          tooltipContent={strings.editBoxCancelButton}
          onRenderIcon={onRenderThemedCancelIcon}
          onClick={() => {
            onCancel && onCancel(message.messageId);
          }}
          id={'dismissIconWrapper'}
        />
        <InputBoxButton
          className={richTextActionButtonsStyle}
          ariaLabel={strings.editBoxSubmitButton}
          tooltipContent={strings.editBoxSubmitButton}
          onRenderIcon={onRenderThemedSubmitIcon}
          onClick={(e) => {
            submitEnabled &&
              onSubmit(
                textValue,
                message.metadata,
                /* @conditional-compile-remove(file-sharing) */ {
                  attachmentMetadata
                }
              );
            e.stopPropagation();
          }}
          id={'submitIconWrapper'}
        />
      </Stack>
    );
  }, [
    /* @conditional-compile-remove(file-sharing) */ attachmentMetadata,
    message.messageId,
    message.metadata,
    onCancel,
    onRenderThemedCancelIcon,
    onRenderThemedSubmitIcon,
    onSubmit,
    strings.editBoxCancelButton,
    strings.editBoxSubmitButton,
    submitEnabled,
    textValue
  ]);
  const richTextLocaleStrings = useMemo(() => {
    /* @conditional-compile-remove(rich-text-editor) */
    return locale.richTextSendBox;
    return locale.sendBox;
  }, [/* @conditional-compile-remove(rich-text-editor) */ locale.richTextSendBox, locale.sendBox]);

  const getContent = (): JSX.Element => {
    return (
      <Stack className={mergeStyles(editBoxWidthStyles)}>
        <RichTextSendBoxErrors textTooLongMessage={textTooLongMessage} systemMessage={message.failureReason} />
        <RichTextInputBoxComponent
          placeholderText={strings.editBoxPlaceholderText}
          onChange={setText}
          editorComponentRef={editTextFieldRef}
          initialContent={message.content}
          strings={richTextLocaleStrings}
          disabled={false}
          actionComponents={actionButtons}
          richTextEditorStyleProps={editBoxRichTextEditorStyle}
          supportHorizontalLayout={false}
        />
      </Stack>
    );
  };

  const attached = message.attached === true ? 'center' : message.attached === 'bottom' ? 'bottom' : 'top';
  return (
    <ChatMyMessage
      attached={attached}
      root={{
        className: chatMyMessageStyles.root
      }}
      body={{
        className: mergeClasses(
          editContainerStyles.body,
          attached !== 'top' ? editContainerStyles.bodyAttached : undefined
        )
      }}
    >
      {getContent()}
    </ChatMyMessage>
  );
};

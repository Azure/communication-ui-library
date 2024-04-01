// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, ITextField, mergeStyles, Stack } from '@fluentui/react';
import { ChatMyMessage } from '@fluentui-contrib/react-chat';
import { mergeClasses } from '@fluentui/react-components';
import { _formatString } from '@internal/acs-ui-common';
import { useTheme } from '../../theming/FluentThemeProvider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { editBoxStyle, editingButtonStyle, editBoxStyleSet, inputBoxIcon } from '../styles/EditBox.styles';
import { InputBoxComponent } from '../InputBoxComponent';
import { InputBoxButton } from '../InputBoxButton';
import { MessageThreadStrings } from '../MessageThread';
import { useChatMyMessageStyles } from '../styles/MessageThread.styles';
import { ChatMessage } from '../../types';
import { _AttachmentUploadCards } from '../AttachmentUploadCards';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { AttachmentMetadata } from '../../types/Attachment';
import {
  chatMessageFailedTagStyle,
  editChatMessageFailedTagStyle,
  chatMessageFailedTagStackItemStyle,
  editChatMessageButtonsStackStyle,
  useChatMessageEditContainerStyles
} from '../styles/ChatMessageComponent.styles';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from '../MentionPopover';
import { MAXIMUM_LENGTH_OF_MESSAGE } from '../utils/SendBoxUtils';
import { getMessageState, onRenderCancelIcon, onRenderSubmitIcon } from '../utils/ChatMessageComponentAsEditBoxUtils';
/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { getMessageAttachedFilesMetadata } from '../utils/ChatMessageComponentAsEditBoxUtils';

/** @private */
export type ChatMessageComponentAsEditBoxProps = {
  onCancel?: (messageId: string) => void;
  onSubmit: (
    text: string,
    metadata?: Record<string, string>,
    options?: {
      /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
      attachmentMetadata?: AttachmentMetadata[];
    }
  ) => void;
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
};

/**
 * @private
 */
export const ChatMessageComponentAsEditBox = (props: ChatMessageComponentAsEditBoxProps): JSX.Element => {
  const { onCancel, onSubmit, strings, message } = props;
  /* @conditional-compile-remove(mention) */
  const { mentionLookupOptions } = props;

  const [textValue, setTextValue] = useState<string>(message.content || '');
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const [attachmentMetadata, setAttachedFilesMetadata] = React.useState(getMessageAttachedFilesMetadata(message));
  const editTextFieldRef = React.useRef<ITextField>(null);
  const theme = useTheme();
  const messageState = getMessageState(
    textValue,
    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ attachmentMetadata ??
      []
  );
  const submitEnabled = messageState === 'OK';

  const editContainerStyles = useChatMessageEditContainerStyles();
  const chatMyMessageStyles = useChatMyMessageStyles();

  useEffect(() => {
    editTextFieldRef.current?.focus();
  }, []);

  const setText = (event?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void => {
    setTextValue(newValue ?? '');
  };

  const textTooLongMessage =
    messageState === 'too long'
      ? _formatString(strings.editBoxTextLimit, { limitNumber: `${MAXIMUM_LENGTH_OF_MESSAGE}` })
      : undefined;

  const iconClassName = useCallback(
    (isHover: boolean) => {
      const color = isHover ? theme.palette.accent : theme.palette.neutralSecondary;
      return mergeStyles(inputBoxIcon, { color });
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

  const editBoxStyles = useMemo(() => {
    return concatStyleSets(editBoxStyleSet, { textField: { borderColor: theme.palette.themePrimary } });
  }, [theme.palette.themePrimary]);

  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  const onRenderAttachmentUploads = useCallback(() => {
    return (
      !!attachmentMetadata &&
      attachmentMetadata.length > 0 && (
        <div style={{ margin: '0.25rem' }}>
          <_AttachmentUploadCards
            activeAttachmentUploads={attachmentMetadata}
            onCancelAttachmentUpload={(fileId) => {
              setAttachedFilesMetadata(attachmentMetadata?.filter((file) => file.id !== fileId));
            }}
          />
        </div>
      )
    );
  }, [attachmentMetadata]);

  const getContent = (): JSX.Element => {
    return (
      <>
        <InputBoxComponent
          data-ui-id="edit-box"
          textFieldRef={editTextFieldRef}
          inputClassName={editBoxStyle}
          placeholderText={strings.editBoxPlaceholderText}
          textValue={textValue}
          onChange={setText}
          onKeyDown={(ev) => {
            if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
              ev.stopPropagation();
            }
          }}
          onEnterKeyDown={() => {
            submitEnabled &&
              onSubmit(
                textValue,
                message.metadata,
                /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ {
                  attachmentMetadata
                }
              );
          }}
          supportNewline={false}
          maxLength={MAXIMUM_LENGTH_OF_MESSAGE}
          errorMessage={textTooLongMessage}
          styles={editBoxStyles}
          /* @conditional-compile-remove(mention) */
          mentionLookupOptions={mentionLookupOptions}
        ></InputBoxComponent>
        <Stack
          horizontal
          horizontalAlign="end"
          className={editChatMessageButtonsStackStyle}
          tokens={{ childrenGap: '0.25rem' }}
        >
          {message.failureReason && (
            <Stack.Item grow align="stretch" className={chatMessageFailedTagStackItemStyle}>
              <div className={mergeStyles(chatMessageFailedTagStyle(theme), editChatMessageFailedTagStyle)}>
                {message.failureReason}
              </div>
            </Stack.Item>
          )}
          <Stack.Item align="end">
            <InputBoxButton
              className={editingButtonStyle}
              ariaLabel={strings.editBoxCancelButton}
              tooltipContent={strings.editBoxCancelButton}
              onRenderIcon={onRenderThemedCancelIcon}
              onClick={() => {
                onCancel && onCancel(message.messageId);
              }}
              id={'dismissIconWrapper'}
            />
          </Stack.Item>
          <Stack.Item align="end">
            <InputBoxButton
              className={editingButtonStyle}
              ariaLabel={strings.editBoxSubmitButton}
              tooltipContent={strings.editBoxSubmitButton}
              onRenderIcon={onRenderThemedSubmitIcon}
              onClick={(e) => {
                submitEnabled &&
                  onSubmit(
                    textValue,
                    message.metadata,
                    /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ {
                      attachmentMetadata
                    }
                  );
                e.stopPropagation();
              }}
              id={'submitIconWrapper'}
            />
          </Stack.Item>
        </Stack>
        {
          /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */ onRenderAttachmentUploads()
        }
      </>
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
          message.failureReason !== undefined ? editContainerStyles.bodyError : editContainerStyles.bodyDefault,
          attached !== 'top' ? editContainerStyles.bodyAttached : undefined
        )
      }}
    >
      {getContent()}
    </ChatMyMessage>
  );
};

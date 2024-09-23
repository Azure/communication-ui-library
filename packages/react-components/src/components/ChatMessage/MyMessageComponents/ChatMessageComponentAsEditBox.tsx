// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, ITextField, mergeStyles, Stack } from '@fluentui/react';
import { ChatMyMessage } from '@fluentui-contrib/react-chat';
import { mergeClasses } from '@fluentui/react-components';
import { _formatString } from '@internal/acs-ui-common';
import { useTheme } from '../../../theming/FluentThemeProvider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
/* @conditional-compile-remove(file-sharing-acs) */
import { useReducer } from 'react';
import { editBoxStyle, editingButtonStyle, editBoxStyleSet, inputBoxIcon } from '../../styles/EditBox.styles';
import { InputBoxComponent } from '../../InputBoxComponent';
import { InputBoxButton } from '../../InputBoxButton';
import { MessageThreadStrings } from '../../MessageThread';
import { useChatMyMessageStyles } from '../../styles/MessageThread.styles';
import { ChatMessage } from '../../../types';
/* @conditional-compile-remove(file-sharing-acs) */
import { _AttachmentUploadCards } from '../../Attachment/AttachmentUploadCards';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata } from '@internal/acs-ui-common';
import {
  chatMessageFailedTagStyle,
  editChatMessageFailedTagStyle,
  chatMessageFailedTagStackItemStyle,
  editChatMessageButtonsStackStyle,
  useChatMessageEditContainerStyles
} from '../../styles/ChatMessageComponent.styles';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from '../../MentionPopover';
import { MAXIMUM_LENGTH_OF_MESSAGE } from '../../utils/SendBoxUtils';
/* @conditional-compile-remove(file-sharing-acs) */
import {
  attachmentMetadataReducer,
  doesMessageContainMultipleAttachments
} from '../../utils/ChatMessageComponentAsEditBoxUtils';
import {
  getMessageState,
  onRenderCancelIcon,
  onRenderSubmitIcon
} from '../../utils/ChatMessageComponentAsEditBoxUtils';
/* @conditional-compile-remove(file-sharing-acs) */
import { getMessageWithAttachmentMetadata } from '../../utils/ChatMessageComponentAsEditBoxUtils';

/** @private */
export type ChatMessageComponentAsEditBoxProps = {
  onCancel?: (messageId: string) => void;
  onSubmit: (
    text: string,
    /* @conditional-compile-remove(file-sharing-acs) */
    attachmentMetadata?: AttachmentMetadata[]
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
  /* @conditional-compile-remove(file-sharing-acs) */
  const [attachmentMetadata, handleAttachmentAction] = useReducer(
    attachmentMetadataReducer,
    getMessageWithAttachmentMetadata(message) ?? []
  );
  const editTextFieldRef = React.useRef<ITextField>(null);
  const theme = useTheme();
  const messageState = getMessageState(
    textValue,
    /* @conditional-compile-remove(file-sharing-acs) */ attachmentMetadata ?? []
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

  /* @conditional-compile-remove(file-sharing-acs) */
  const hasMultipleAttachments = useMemo(() => {
    return doesMessageContainMultipleAttachments(message);
  }, [message]);

  const editBoxStyles = useMemo(() => {
    return concatStyleSets(editBoxStyleSet, { textField: { borderColor: theme.palette.themePrimary } });
  }, [theme.palette.themePrimary]);

  /* @conditional-compile-remove(file-sharing-acs) */
  const onRenderAttachmentUploads = useCallback(() => {
    return (
      !!attachmentMetadata &&
      attachmentMetadata.length > 0 && (
        <div style={{ margin: '0.25rem' }}>
          <_AttachmentUploadCards
            attachments={attachmentMetadata}
            onCancelAttachmentUpload={(id) => {
              // edit box only capable of removing attachments
              // we need to expand attachment actions
              // if we want to support more actions e.g. add
              handleAttachmentAction({ type: 'remove', id });
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
                /* @conditional-compile-remove(file-sharing-acs) */
                attachmentMetadata
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
              data-testId="chat-message-edit-box-cancel-button"
            />
          </Stack.Item>
          <Stack.Item align="end">
            <InputBoxButton
              className={editingButtonStyle}
              ariaLabel={strings.editBoxSubmitButton}
              tooltipContent={strings.editBoxSubmitButton}
              onRenderIcon={onRenderThemedSubmitIcon}
              onClick={(e) => {
                // it's very important to pass an empty attachment here
                // so when user remvoes all attachments, UI can reflect it instantly
                // if you set it to undefined, the attachments pre-edited would still be there
                // until edit message event is received
                submitEnabled &&
                  onSubmit(textValue, /* @conditional-compile-remove(file-sharing-acs) */ attachmentMetadata);
                e.stopPropagation();
              }}
              id={'submitIconWrapper'}
              data-testId="chat-message-edit-box-submit-button"
            />
          </Stack.Item>
        </Stack>
        {/* @conditional-compile-remove(file-sharing-acs) */ onRenderAttachmentUploads()}
      </>
    );
  };

  const attached = message.attached === true ? 'center' : message.attached === 'bottom' ? 'bottom' : 'top';
  return (
    <ChatMyMessage
      attached={attached}
      root={{
        className: mergeClasses(
          chatMyMessageStyles.root,
          /* @conditional-compile-remove(file-sharing-acs) */
          hasMultipleAttachments ? chatMyMessageStyles.multipleAttachmentsInEditing : undefined
        )
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

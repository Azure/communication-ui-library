// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, Icon, ITextField, mergeStyles, Stack } from '@fluentui/react';
import { ChatMyMessage } from '@fluentui-contrib/react-chat';
import { mergeClasses } from '@fluentui/react-components';
import { _formatString } from '@internal/acs-ui-common';
import { useTheme } from '../../theming/FluentThemeProvider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { editBoxStyle, inputBoxIcon, editingButtonStyle, editBoxStyleSet } from '../styles/EditBox.styles';
import { InputBoxComponent } from '../InputBoxComponent';
import { InputBoxButton } from '../InputBoxButton';
import { MessageThreadStrings } from '../MessageThread';
import { useChatMyMessageStyles } from '../styles/MessageThread.styles';
import { ChatMessage } from '../../types';
import { _FileUploadCards } from '../FileUploadCards';
/* @conditional-compile-remove(file-sharing) */
import { FileMetadata } from '../FileDownloadCards';
import {
  chatMessageFailedTagStyle,
  editChatMessageFailedTagStyle,
  chatMessageFailedTagStackItemStyle,
  editChatMessageButtonsStackStyle,
  useChatMessageEditContainerStyles
} from '../styles/ChatMessageComponent.styles';
/* @conditional-compile-remove(mention) */
import { MentionLookupOptions } from '../MentionPopover';

const MAXIMUM_LENGTH_OF_MESSAGE = 8000;

const onRenderCancelIcon = (color: string): JSX.Element => {
  const className = mergeStyles(inputBoxIcon, { color });
  return <Icon iconName={'EditBoxCancel'} className={className} />;
};

const onRenderSubmitIcon = (color: string): JSX.Element => {
  const className = mergeStyles(inputBoxIcon, { color });
  return <Icon iconName={'EditBoxSubmit'} className={className} />;
};

/** @private */
export type ChatMessageComponentAsEditBoxProps = {
  onCancel?: (messageId: string) => void;
  onSubmit: (
    text: string,
    metadata?: Record<string, string>,
    options?: {
      /* @conditional-compile-remove(file-sharing) */
      attachmentMetadata?: FileMetadata[];
    }
  ) => void;
  message: ChatMessage;
  strings: MessageThreadStrings;
  /* @conditional-compile-remove(mention) */
  mentionLookupOptions?: MentionLookupOptions;
};

type MessageState = 'OK' | 'too short' | 'too long';

/**
 * @private
 */
export const ChatMessageComponentAsEditBox = (props: ChatMessageComponentAsEditBoxProps): JSX.Element => {
  const { onCancel, onSubmit, strings, message } = props;
  /* @conditional-compile-remove(mention) */
  const { mentionLookupOptions } = props;

  const [textValue, setTextValue] = useState<string>(message.content || '');
  /* @conditional-compile-remove(file-sharing) */
  const [attachmentMetadata, setAttachedFilesMetadata] = React.useState(getMessageAttachedFilesMetadata(message));
  const editTextFieldRef = React.useRef<ITextField>(null);
  const theme = useTheme();
  const messageState = getMessageState(
    textValue,
    /* @conditional-compile-remove(file-sharing) */ attachmentMetadata ?? []
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

  const onRenderThemedCancelIcon = useCallback(
    (isHover: boolean) => onRenderCancelIcon(isHover ? theme.palette.accent : theme.palette.neutralSecondary),
    [theme.palette.neutralSecondary, theme.palette.accent]
  );

  const onRenderThemedSubmitIcon = useCallback(
    (isHover: boolean) => onRenderSubmitIcon(isHover ? theme.palette.accent : theme.palette.neutralSecondary),
    [theme.palette.neutralSecondary, theme.palette.accent]
  );

  const editBoxStyles = useMemo(() => {
    return concatStyleSets(editBoxStyleSet, { textField: { borderColor: theme.palette.themePrimary } });
  }, [theme.palette.themePrimary]);

  /* @conditional-compile-remove(file-sharing) */
  const onRenderFileUploads = useCallback(() => {
    return (
      !!attachmentMetadata &&
      attachmentMetadata.length > 0 && (
        <div style={{ margin: '0.25rem' }}>
          <_FileUploadCards
            activeFileUploads={attachmentMetadata?.map((file) => ({
              id: file.name,
              filename: file.name,
              progress: 1
            }))}
            onCancelFileUpload={(fileId) => {
              setAttachedFilesMetadata(attachmentMetadata?.filter((file) => file.name !== fileId));
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
                /* @conditional-compile-remove(file-sharing) */ {
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
                    /* @conditional-compile-remove(file-sharing) */ {
                      attachmentMetadata
                    }
                  );
                e.stopPropagation();
              }}
              id={'submitIconWrapper'}
            />
          </Stack.Item>
        </Stack>
        {/* @conditional-compile-remove(file-sharing) */ onRenderFileUploads()}
      </>
    );
  };

  const attached = message.attached === true ? 'center' : message.attached === 'bottom' ? 'bottom' : 'top';
  return (
    <ChatMyMessage
      attached={attached}
      root={{
        className: mergeClasses(chatMyMessageStyles.root, editContainerStyles.root)
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

const isMessageTooLong = (messageText: string): boolean => messageText.length > MAXIMUM_LENGTH_OF_MESSAGE;
function isMessageEmpty(
  messageText: string,
  /* @conditional-compile-remove(file-sharing) */
  attachmentMetadata?: FileMetadata[]
): boolean {
  /* @conditional-compile-remove(file-sharing) */
  return messageText.trim().length === 0 && attachmentMetadata?.length === 0;
  return messageText.trim().length === 0;
}
function getMessageState(
  messageText: string,
  /* @conditional-compile-remove(file-sharing) */ attachmentMetadata: FileMetadata[]
): MessageState {
  return isMessageEmpty(messageText, /* @conditional-compile-remove(file-sharing) */ attachmentMetadata)
    ? 'too short'
    : isMessageTooLong(messageText)
    ? 'too long'
    : 'OK';
}

/* @conditional-compile-remove(file-sharing) */
// @TODO: Remove when file-sharing feature becomes stable.
const getMessageAttachedFilesMetadata = (message: ChatMessage): FileMetadata[] | undefined => {
  return message.files;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import {
  CommunicationParticipant,
  ErrorBar,
  MessageProps,
  MessageRenderer,
  MessageThread,
  MessageThreadStyles,
  ParticipantMenuItemsCallback,
  SendBox,
  SendBoxStylesProps,
  TypingIndicator,
  TypingIndicatorStylesProps
} from '@internal/react-components';
import React, { useCallback, useEffect } from 'react';
import { AvatarPersona, AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { ChatCompositeOptions } from './ChatComposite';
import { ChatHeader, getHeaderProps } from './ChatHeader';
import { UploadedFile } from './file-sharing';
import { FileCardGroup } from './file-sharing/FileCardGroup';
import { FileUploadButton } from './file-sharing/FileUploadButton';
import { UploadedFileCard } from './file-sharing/UploadedFileCard';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';
import { useSelector } from './hooks/useSelector';
/* @conditional-compile-remove-from(stable) */
import { ParticipantContainer } from './ParticipantContainer';
import { uploadedFilesSelector } from './selectors/uploadedFileSelector';
import {
  chatArea,
  chatContainer,
  chatWrapper,
  messageThreadChatCompositeStyles,
  participantListContainerPadding,
  sendBoxChatCompositeStyles,
  typingIndicatorChatCompositeStyles,
  typingIndicatorContainerStyles
} from './styles/Chat.styles';

/**
 * @private
 */
export type ChatScreenProps = {
  options?: ChatCompositeOptions;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element;
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  styles?: ChatScreenStyles;
  hasFocusOnMount?: 'sendBoxTextField' | false;
};

/**
 * @private
 */
export type ChatScreenStyles = {
  messageThread?: MessageThreadStyles;
  sendBox?: SendBoxStylesProps;
  typingIndicator?: TypingIndicatorStylesProps;
};

/**
 * @private
 */
export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { onFetchAvatarPersonaData, onRenderMessage, onRenderTypingIndicator, options, styles } = props;

  const defaultNumberOfChatMessagesToReload = 5;
  const sendBoxParentStyle = mergeStyles({ width: '100%' });

  const adapter = useAdapter();

  useEffect(() => {
    adapter.fetchInitialData();
  }, [adapter]);

  const messageThreadProps = usePropsFor(MessageThread);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);
  const uploadedFiles = useSelector(uploadedFilesSelector);

  // For marking all files as uploaded.
  // TODO: Remove this once we have a better way to handle this.
  useEffect(() => {
    if (!uploadedFiles.files) {
      return;
    }

    const uploadCompleteListener = (): void => {
      for (const file of uploadedFiles.files || []) {
        if (!file.isUploaded()) {
          return;
        }
      }
      adapter.uploadsComplete && adapter.uploadsComplete();
    };

    uploadedFiles.files.forEach((file) => {
      file.on('uploadCompleted', uploadCompleteListener);
    });

    return () => {
      uploadedFiles.files?.forEach((file) => {
        file.off('uploadCompleted', uploadCompleteListener);
      });
    };
  }, [adapter, uploadedFiles.files]);

  const onRenderAvatarCallback = useCallback(
    (userId, defaultOptions) => {
      return (
        <AvatarPersona
          userId={userId}
          hidePersonaDetails={true}
          {...defaultOptions}
          dataProvider={onFetchAvatarPersonaData}
        />
      );
    },
    [onFetchAvatarPersonaData]
  );

  const sendBoxStyles = Object.assign({}, sendBoxChatCompositeStyles, styles?.sendBox);
  const messageThreadStyles = Object.assign({}, messageThreadChatCompositeStyles, styles?.messageThread);
  const typingIndicatorStyles = Object.assign({}, typingIndicatorChatCompositeStyles, styles?.typingIndicator);

  return (
    <Stack className={chatContainer} grow>
      {options?.topic !== false && <ChatHeader {...headerProps} />}
      <Stack className={chatArea} tokens={participantListContainerPadding} horizontal grow>
        <Stack className={chatWrapper} grow>
          {options?.errorBar !== false && <ErrorBar {...errorBarProps} />}
          <MessageThread
            {...messageThreadProps}
            onRenderAvatar={onRenderAvatarCallback}
            onRenderMessage={onRenderMessage}
            numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
            styles={messageThreadStyles}
          />

          <Stack style={{ maxWidth: '41.25rem', alignSelf: 'center', width: '100%' }}>
            <FileCardGroup>
              {uploadedFiles.files?.map((uploadedFile, idx) => (
                <UploadedFileCard key={idx} uploadedFile={uploadedFile} />
              ))}
            </FileCardGroup>
            <br />
            <FileUploadButton userId={sendBoxProps.userId} fileUploadHandler={fileUploadHandler} />
          </Stack>

          <Stack className={sendBoxParentStyle}>
            <div className={mergeStyles(typingIndicatorContainerStyles)}>
              {onRenderTypingIndicator ? (
                onRenderTypingIndicator(typingIndicatorProps.typingUsers)
              ) : (
                <TypingIndicator {...typingIndicatorProps} styles={typingIndicatorStyles} />
              )}
            </div>
            <SendBox
              {...sendBoxProps}
              autoFocus={options?.autoFocus}
              styles={sendBoxStyles}
              // Don't let users send messages if all files have not been uploaded.
              // disabled={uploadedFiles.files && !uploadedFiles.completed}
            />
          </Stack>
        </Stack>
        {
          /* @conditional-compile-remove-from(stable) */
          options?.participantPane === true && (
            <ParticipantContainer
              onFetchAvatarPersonaData={onFetchAvatarPersonaData}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
            />
          )
        }
      </Stack>
    </Stack>
  );
};

/**
 * Test function
 * @TODO: Remove this function later
 * @internal
 */
const fileUploadHandler = async (userId: string, uploadedFiles: UploadedFile[]): Promise<void> => {
  // Simulate uploading the file to a server
  for (const file of uploadedFiles) {
    let progress = 0;
    for (let index = 0; index < 20; index++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      progress += 0.05;
      file.updateProgress(progress);
    }
    // Mark file upload as complete
    file.completeUpload({
      name: file.file.name,
      extension: file.extension(),
      url: 'https://www.google.com'
    });
  }
};

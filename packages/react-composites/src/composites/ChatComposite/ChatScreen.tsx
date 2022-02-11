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
import { FileUploadButtonWrapper as FileUploadButton } from './file-sharing';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';
/* @conditional-compile-remove-from(stable) */
import { FileCard, FileCardGroup, truncatedFileName, extension, FileUpload, FileUploadHandler } from './file-sharing';

import {
  chatArea,
  chatContainer,
  chatWrapper,
  messageThreadChatCompositeStyles,
  sendboxContainerStyles,
  typingIndicatorContainerStyles
} from './styles/Chat.styles';

/* @conditional-compile-remove-from(stable) */
import { ParticipantContainer } from '../common/ParticipantContainer';
/* @conditional-compile-remove-from(stable) */
import { useLocale } from '../localization';
import { participantListContainerPadding } from '../common/styles/ParticipantContainer.styles';
/* @conditional-compile-remove-from(stable) */
import { ParticipantList } from '@internal/react-components';

/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { fileUploadsSelector } from './selectors/fileUploadsSelector';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { useSelector } from './hooks/useSelector';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { Icon } from '@fluentui/react';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';

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
  fileSharing?: FileSharingOptions;
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
 * Properties for configuring the File Sharing feature.
 * @beta
 */
export interface FileSharingOptions {
  /**
   * A string containing the comma separated list of accepted file types.
   * Similar to the `accept` attribute of the `<input type="file" />` element.
   * Accepts any type of file if not specified.
   * @beta
   */
  accept?: string;
  /**
   * Allows multiple files to be selected if set to `true`.
   * Similar to the `multiple` attribute of the `<input type="file" />` element.
   * @defaultValue false
   * @beta
   */
  multiple?: boolean;
  /* @conditional-compile-remove-from(stable): FILE_SHARING */
  /**
   * A function of type {@link FileUploadHandler} for handling file uploads.
   * @beta
   */
  uploadHandler: FileUploadHandler;
}

/**
 * @private
 */
export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { onFetchAvatarPersonaData, onRenderMessage, onRenderTypingIndicator, options, styles, fileSharing } = props;

  const defaultNumberOfChatMessagesToReload = 5;

  const adapter = useAdapter();

  /* @conditional-compile-remove-from(stable) */
  const locale = useLocale();
  /* @conditional-compile-remove-from(stable) */
  const chatListHeader = locale.strings.chat.chatListHeader;

  useEffect(() => {
    adapter.fetchInitialData();
  }, [adapter]);

  const messageThreadProps = usePropsFor(MessageThread);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);
  /* @conditional-compile-remove-from(stable) */
  const participantListProps = usePropsFor(ParticipantList);

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

  /* @conditional-compile-remove-from(stable): FILE_SHARING */
  const uploadedFilesSelector = useSelector(fileUploadsSelector);

  /* @conditional-compile-remove-from(stable): FILE_SHARING */
  const onRenderFileUploads = (): JSX.Element => {
    const uploadedFiles = uploadedFilesSelector.files;
    const truncateLength = 15;
    return (
      <FileCardGroup>
        {uploadedFiles &&
          uploadedFiles.map((file) => (
            <FileCard
              fileName={truncatedFileName(file.filename, truncateLength)}
              progress={file.progress}
              key={file.id}
              fileExtension={extension(file.filename)}
              actionIcon={<Icon iconName="Cancel" />}
              actionHandler={() => {
                adapter.cancelFileUpload && adapter.cancelFileUpload(file.id);
              }}
            />
          ))}
      </FileCardGroup>
    );
  };

  const messageThreadStyles = Object.assign({}, messageThreadChatCompositeStyles, styles?.messageThread);
  const typingIndicatorStyles = Object.assign({}, styles?.typingIndicator);
  const sendBoxStyles = Object.assign({}, styles?.sendBox);
  const userId = toFlatCommunicationIdentifier(adapter.getState().userId);

  const fileUploadButtonOnChange = (files: FileList | null): void => {
    if (!files) {
      return;
    }
    /* @conditional-compile-remove-from(stable): FILE_SHARING */
    const fileUploads = Array.from(files).map((file) => new FileUpload(file));
    /* @conditional-compile-remove-from(stable): FILE_SHARING */
    adapter.registerFileUploads && adapter.registerFileUploads(fileUploads);
    /* @conditional-compile-remove-from(stable): FILE_SHARING */
    fileSharing?.uploadHandler(adapter.getState().userId, fileUploads);
  };

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
          <Stack className={mergeStyles(sendboxContainerStyles)}>
            <div className={mergeStyles(typingIndicatorContainerStyles)}>
              {onRenderTypingIndicator ? (
                onRenderTypingIndicator(typingIndicatorProps.typingUsers)
              ) : (
                <TypingIndicator {...typingIndicatorProps} styles={typingIndicatorStyles} />
              )}
            </div>
            <SendBox
              {...sendBoxProps}
              /* @conditional-compile-remove-from(stable): FILE_SHARING */
              onRenderFileUploads={onRenderFileUploads}
              autoFocus={options?.autoFocus}
              styles={sendBoxStyles}
            />

            <FileUploadButton
              accept={fileSharing?.accept}
              multiple={fileSharing?.multiple}
              onChange={fileUploadButtonOnChange}
            />
          </Stack>
        </Stack>
        {
          /* @conditional-compile-remove-from(stable) */
          options?.participantPane === true && (
            <ParticipantContainer
              participantListProps={participantListProps}
              onFetchAvatarPersonaData={onFetchAvatarPersonaData}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
              title={chatListHeader}
            />
          )
        }
      </Stack>
    </Stack>
  );
};

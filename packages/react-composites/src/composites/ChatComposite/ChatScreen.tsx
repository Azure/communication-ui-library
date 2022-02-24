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
import {
  FileUploadButtonWrapper as FileUploadButton,
  FileUpload,
  FileUploadHandler,
  FileDownloadHandler
} from './file-sharing';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';
import { usePropsFor } from './hooks/usePropsFor';

import {
  chatArea,
  chatContainer,
  chatWrapper,
  messageThreadChatCompositeStyles,
  sendboxContainerStyles,
  typingIndicatorContainerStyles
} from './styles/Chat.styles';
import { participantListContainerPadding } from '../common/styles/ParticipantContainer.styles';
/* @conditional-compile-remove-from(stable) */
import { ChatScreenPeoplePane } from './ChatScreenPeoplePane';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { FileUploadCards } from './FileUploadCards';
/* @conditional-compile-remove-from(stable): FILE_SHARING */
import { FileDownloadCards } from './FileDownloadCards';

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
  hasFocusOnMount?: 'sendBoxTextField';
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
  /**
   * A function of type {@link FileUploadHandler} for handling file uploads.
   * @beta
   */
  uploadHandler: FileUploadHandler;
  /**
   * A function of type {@link FileDownloadHandler} for handling file downloads.
   * If the function is not specified, the file's `url` will be opened in a new tab to
   * initiate the download.
   */
  downloadHandler?: FileDownloadHandler;
}

/**
 * @private
 */
export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { onFetchAvatarPersonaData, onRenderMessage, onRenderTypingIndicator, options, styles, fileSharing } = props;

  const defaultNumberOfChatMessagesToReload = 5;

  const adapter = useAdapter();

  useEffect(() => {
    adapter.fetchInitialData();
  }, [adapter]);

  const messageThreadProps = usePropsFor(MessageThread);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const headerProps = useAdaptedSelector(getHeaderProps);
  const errorBarProps = usePropsFor(ErrorBar);

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

  const messageThreadStyles = Object.assign({}, messageThreadChatCompositeStyles, styles?.messageThread);
  const typingIndicatorStyles = Object.assign({}, styles?.typingIndicator);
  const sendBoxStyles = Object.assign({}, styles?.sendBox);
  const userId = toFlatCommunicationIdentifier(adapter.getState().userId);

  const fileUploadButtonOnChange = (files: FileList | null): void => {
    if (!files) {
      return;
    }

    const fileUploads = Array.from(files).map((file) => new FileUpload(file));
    /* @conditional-compile-remove-from(stable): FILE_SHARING */
    fileSharing?.uploadHandler && adapter.registerFileUploads && adapter.registerFileUploads(fileUploads);
    fileSharing?.uploadHandler(userId, fileUploads);
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
            /* @conditional-compile-remove-from(stable): FILE_SHARING */
            onRenderFileDownloads={(userId, message) => <FileDownloadCards userId={userId} message={message} />}
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
              onRenderFileUploads={() => <FileUploadCards />}
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
            <ChatScreenPeoplePane
              onFetchAvatarPersonaData={onFetchAvatarPersonaData}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
            />
          )
        }
      </Stack>
    </Stack>
  );
};

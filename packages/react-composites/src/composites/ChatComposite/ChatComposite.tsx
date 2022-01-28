// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationParticipant, MessageRenderer, MessageProps } from '@internal/react-components';
import React from 'react';
import { BaseComposite, BaseCompositeProps } from '../common/BaseComposite';
import { ChatCompositeIcons } from '../common/icons';
import { ChatAdapter } from './adapter/ChatAdapter';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { chatScreenContainerStyle } from './styles/Chat.styles';
import { ChatScreen } from './ChatScreen';
/* @conditional-compile-remove-from(stable) */
import { FileUploadHandler } from './file-sharing/FileUploadHandler';

/**
 * Props for {@link ChatComposite}.
 *
 * @public
 */
export interface ChatCompositeProps extends BaseCompositeProps<ChatCompositeIcons> {
  /**
   * An adapter provides logic and data to the composite.
   * Composite can also be controlled using the adapter.
   */
  adapter: ChatAdapter;
  /**
   * `(messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element`
   * A callback for customizing the message renderer.
   */
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element;
  /**
   * `(typingUsers: CommunicationParticipant[]) => JSX.Element`
   * A callback for customizing the typing indicator renderer.
   */
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;

  /**
   * Flags to enable/disable visual elements of the {@link ChatComposite}.
   */
  options?: ChatCompositeOptions;
}

/**
 * Optional features of the {@link ChatComposite}.
 *
 * @public
 */
export type ChatCompositeOptions = {
  /**
   * Surface Azure Communication Services backend errors in the UI with {@link @azure/communication-react#ErrorBar}.
   * Hide or show the error bar.
   * @defaultValue true
   */
  errorBar?: boolean;
  /* @conditional-compile-remove-from(stable) */
  /**
   * Show or hide the participant pane. This feature is in beta and not supported on mobile or narrow screen views.
   * @defaultValue false
   *
   * @beta
   */
  participantPane?: boolean;
  /**
   * Show or hide the topic at the top of the chat. Hidden if set to `false`
   * @defaultValue true
   */
  topic?: boolean;
  /**
   * Set focus on the composite when the composite first mounts.
   */
  autoFocus?: 'sendBoxTextField' | false;
  /* @conditional-compile-remove-from(stable) */
  /**
   * A string containing the comma separated list of accepted file types.
   * Similar to the `accept` attribute of the `<input type="file" />` element.
   * @beta
   */
  fileUploadAccept?: string;
  /* @conditional-compile-remove-from(stable) */
  /**
   * Allows multiple files to be selected if set to `true`.
   * Similar to the `multiple` attribute of the `<input type="file" />` element.
   * @defaultValue false
   * @beta
   */
  fileUploadMultiple?: boolean;
  /* @conditional-compile-remove-from(stable) */
  /**
   * The function of type {@link FileUploadHandler} for handling file uploads.
   * @beta
   */
  fileUploadHandler?: FileUploadHandler;
};

/**
 * A customizable UI composite for the chat experience.
 *
 * @remarks Chat composite min width and height are respectively 19.5rem and 20rem (312px and 320px, with default rem at 16px)
 *
 * @public
 */
export const ChatComposite = (props: ChatCompositeProps): JSX.Element => {
  const {
    adapter,
    options,
    onFetchAvatarPersonaData,
    onRenderTypingIndicator,
    onRenderMessage,
    onFetchParticipantMenuItems
  } = props;

  /**
   * @TODO Remove this function and pass the props directly when FILE_SHARING is promoted to stable.
   * @private
   */
  const fileSharingOptions = () => {
    /* @conditional-compile-remove-from(stable) */
    return {
      fileUploadAccept: options?.fileUploadAccept,
      fileUploadMultiple: options?.fileUploadMultiple,
      fileUploadHandler: options?.fileUploadHandler
    };
    return {};
  };

  return (
    <div className={chatScreenContainerStyle}>
      <BaseComposite {...props}>
        <ChatAdapterProvider adapter={adapter}>
          <ChatScreen
            options={options}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            onRenderTypingIndicator={onRenderTypingIndicator}
            onRenderMessage={onRenderMessage}
            onFetchParticipantMenuItems={onFetchParticipantMenuItems}
            {...fileSharingOptions()}
          />
        </ChatAdapterProvider>
      </BaseComposite>
    </div>
  );
};

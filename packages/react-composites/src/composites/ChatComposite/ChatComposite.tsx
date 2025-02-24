// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationParticipant, MessageRenderer, MessageProps } from '@internal/react-components';
import React from 'react';
import { BaseProvider, BaseCompositeProps } from '../common/BaseComposite';
import { ChatCompositeIcons } from '../common/icons';
import { ChatAdapter } from './adapter/ChatAdapter';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { chatScreenContainerStyle } from './styles/Chat.styles';
import { ChatScreen } from './ChatScreen';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentOptions } from '@internal/react-components';

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
  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Optimizes the composite form factor for either desktop or mobile.
   * @remarks `mobile` is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue 'desktop'
   */
  formFactor?: 'desktop' | 'mobile';
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
  /* @conditional-compile-remove(chat-composite-participant-pane) */
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
   * enumerable to determine if the input box has focus on render or not.
   * When undefined nothing has focus on render
   */
  autoFocus?: 'sendBoxTextField';

  /* @conditional-compile-remove(file-sharing-acs) */
  /**
   * Properties for configuring the File Sharing feature.
   * If undefined, file sharing feature will be disabled.
   * @beta
   */
  attachmentOptions?: AttachmentOptions;

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  /**
   * Enables rich text editor for the send and edit boxes
   * @defaultValue `false`
   *
   * @beta
   */
  richTextEditor?: boolean;
};

/**
 * A customizable UI composite for the chat experience.
 *
 * @remarks Chat composite min width and height are respectively 17.5rem and 20rem (280px and 320px, with default rem at 16px)
 *
 * @public
 */
export const ChatComposite = (props: ChatCompositeProps): JSX.Element => {
  const {
    adapter,
    options,
    onFetchAvatarPersonaData,
    /* @conditional-compile-remove(composite-onRenderAvatar-API) */
    onRenderAvatar,
    onRenderTypingIndicator,
    onRenderMessage,
    onFetchParticipantMenuItems
  } = props;

  /* @conditional-compile-remove(file-sharing-acs) */
  const formFactor = props['formFactor'] || 'desktop';

  return (
    <div className={chatScreenContainerStyle}>
      <BaseProvider {...props}>
        <ChatAdapterProvider adapter={adapter}>
          <ChatScreen
            /* @conditional-compile-remove(file-sharing-acs) */
            formFactor={formFactor}
            options={options}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            /* @conditional-compile-remove(composite-onRenderAvatar-API) */
            onRenderAvatar={onRenderAvatar}
            onRenderTypingIndicator={onRenderTypingIndicator}
            onRenderMessage={onRenderMessage}
            onFetchParticipantMenuItems={onFetchParticipantMenuItems}
            /* @conditional-compile-remove(file-sharing-acs) */
            attachmentOptions={options?.attachmentOptions}
          />
        </ChatAdapterProvider>
      </BaseProvider>
    </div>
  );
};

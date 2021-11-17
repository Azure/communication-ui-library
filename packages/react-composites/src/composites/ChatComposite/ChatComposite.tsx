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
          />
        </ChatAdapterProvider>
      </BaseComposite>
    </div>
  );
};

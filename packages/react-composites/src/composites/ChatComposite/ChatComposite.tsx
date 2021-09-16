// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationParticipant, MessageRenderer, MessageProps } from '@internal/react-components';
import React from 'react';
import { BaseComposite, BaseCompositeProps } from '../common/Composite';
import { ChatCompositeIcons } from '../common/icons';
import { ChatAdapter } from './adapter/ChatAdapter';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { ChatScreen } from './ChatScreen';

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

export type ParticipantOptions = {
  enableContextualMenu: true;
};

/**
 * Optional features of the {@linnk ChatComposite}
 */
export type ChatCompositeOptions = {
  /**
   * Surface Azure Communication Services backend errors in the UI with {@link @azure/communication-react#ErrorBar}.
   *
   * @defaultValue false
   */
  errorBar?: boolean;
  /**
   * Choose to show the participant pane
   * @defaultValue false
   */
  participantPane?: boolean | ParticipantOptions;
  /**
   * Choose to show the topic at the top of the chat
   * @defaultValue false
   */
  topic?: boolean;
};

export const ChatComposite = (props: ChatCompositeProps): JSX.Element => {
  const { adapter, options, onFetchAvatarPersonaData, onRenderTypingIndicator, onRenderMessage } = props;

  return (
    <BaseComposite {...props}>
      <ChatAdapterProvider adapter={adapter}>
        <ChatScreen
          showErrorBar={options?.errorBar}
          showParticipantPane={!!options?.participantPane}
          showTopic={options?.topic}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onRenderTypingIndicator={onRenderTypingIndicator}
          onRenderMessage={onRenderMessage}
        />
      </ChatAdapterProvider>
    </BaseComposite>
  );
};

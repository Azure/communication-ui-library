// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationParticipant, DefaultMessageRendererType, MessageProps } from '@internal/react-components';
import React from 'react';
import { BaseComposite, BaseCompositeProps } from '../common/Composite';
import { ChatAdapter } from './adapter/ChatAdapter';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { ChatScreen } from './ChatScreen';

export interface ChatCompositeProps extends BaseCompositeProps {
  /**
   * An adapter provides logic and data to the composite.
   * Composite can also be controlled using the adapter.
   */
  adapter: ChatAdapter;
  /**
   * `(messageProps: MessageProps, defaultOnRender?: DefaultMessageRendererType) => JSX.Element`
   * A callback for customizing the message renderer.
   */
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: DefaultMessageRendererType) => JSX.Element;
  /**
   * `(typingUsers: CommunicationParticipant[]) => JSX.Element`
   * A callback for customizing the typing indicator renderer.
   */
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;

  /**
   * Flags to enable/disable visual elements of the {@link ChatComposite}.
   */
  visualElements?: ChatCompositeVisualElements;
}

/**
 * Optional features of the {@linnk ChatComposite}
 */
export type ChatCompositeVisualElements = {
  /**
   * UNSTABLE: Feature flag to enable ErrorBar.
   *
   * This option will be removed once ErrorBar is stable.
   * @experimental
   *
   * @defaultValue false
   */
  showErrorBar?: boolean;
  /**
   * Choose to show the participant pane
   * @defaultValue false
   */
  showParticipantPane?: boolean;
  /**
   * Choose to show the topic at the top of the chat
   * @defaultValue false
   */
  showTopic?: boolean;
};

export const ChatComposite = (props: ChatCompositeProps): JSX.Element => {
  const { adapter, visualElements, onFetchAvatarPersonaData, onRenderTypingIndicator, onRenderMessage } = props;

  return (
    <BaseComposite {...props}>
      <ChatAdapterProvider adapter={adapter}>
        <ChatScreen
          showErrorBar={visualElements?.showErrorBar}
          showParticipantPane={visualElements?.showParticipantPane}
          showTopic={visualElements?.showTopic}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onRenderTypingIndicator={onRenderTypingIndicator}
          onRenderMessage={onRenderMessage}
        />
      </ChatAdapterProvider>
    </BaseComposite>
  );
};

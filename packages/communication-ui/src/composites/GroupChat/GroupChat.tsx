// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
import { AbortSignalLike } from '@azure/core-http';
import { CommunicationUiErrorInfo } from '../../types/CommunicationUiError';
import { ChatScreen } from './ChatScreen';
import { createAzureCommunicationUserCredentialBeta, getIdFromToken } from '../../utils';
import { ChatClient } from '@azure/communication-chat';
import { chatClientDeclaratify } from '@azure/acs-chat-declarative';
import { GroupChatAdapterProvider } from './adapter/GroupChatAdapterProvider';
import { AzureChatAdapter } from './adapter/AzureChatAdapter';

export type GroupChatProps = {
  displayName: string;
  threadId: string;
  token: string;
  endpointUrl: string;
  onRenderAvatar?: (userId: string) => JSX.Element;
  refreshTokenCallback?: (abortSignal?: AbortSignalLike) => Promise<string>;
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
  options?: GroupChatOptions;
};

type GroupChatOptions = {
  sendBoxMaxLength?: number; // Limit max send box length, when change viewport size
  // messagesPerPage?: number; // Number of messages per page - smaller for better perf
  // supportNewline: boolean; // Whether to support new line (shift+enter) in textArea, disable until ACS backend supports line switch
};

export default (props: GroupChatProps): JSX.Element | undefined => {
  const { displayName, threadId, token, options, onRenderAvatar } = props;

  const [adapter, setAdapter] = useState<AzureChatAdapter | undefined>();

  useEffect(() => {
    const init = async (): Promise<void> => {
      const idFromToken = getIdFromToken(token);

      const chatClient = chatClientDeclaratify(
        new ChatClient(
          props.endpointUrl,
          createAzureCommunicationUserCredentialBeta(token, props.refreshTokenCallback)
        ),
        { userId: idFromToken, displayName }
      );
      const chatThreadClient = await chatClient.getChatThreadClient(threadId);

      chatClient.startRealtimeNotifications();

      const adapter = new AzureChatAdapter(chatClient, chatThreadClient);
      adapter.loadPreviousChatMessages(20);

      setAdapter(adapter);
    };
    init();
  }, [displayName, props.endpointUrl, props.refreshTokenCallback, threadId, token]);

  return adapter ? (
    <GroupChatAdapterProvider adapter={adapter}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <ChatScreen threadId={threadId} sendBoxMaxLength={options?.sendBoxMaxLength} onRenderAvatar={onRenderAvatar} />
    </GroupChatAdapterProvider>
  ) : (
    <div />
  );
};

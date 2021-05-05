// © Microsoft Corporation. All rights reserved.

import { ChatProvider } from '../../providers';
import React from 'react';
import { AbortSignalLike } from '@azure/core-http';
import { ErrorProvider } from '../../providers/ErrorProvider';
import { CommunicationUiErrorInfo } from '../../types/CommunicationUiError';
import { ChatScreen } from './ChatScreen';

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

export default (props: GroupChatProps): JSX.Element => {
  const { displayName, threadId, token, endpointUrl, options, onErrorCallback, onRenderAvatar } = props;

  return (
    <ErrorProvider onErrorCallback={onErrorCallback}>
      <ChatProvider
        displayName={displayName}
        threadId={threadId}
        token={token}
        endpointUrl={endpointUrl}
        refreshTokenCallback={props.refreshTokenCallback}
      >
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <ChatScreen threadId={threadId} sendBoxMaxLength={options?.sendBoxMaxLength} onRenderAvatar={onRenderAvatar} />
      </ChatProvider>
    </ErrorProvider>
  );
};

// © Microsoft Corporation. All rights reserved.
import { Stack } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react';
import { ChatProvider } from '../../providers';
import React from 'react';
import { SendBox, TypingIndicator } from '../../components';
import { ChatThread } from './ChatThread';
import { chatContainer, chatWrapper } from './styles/GroupChat.styles';
import { AbortSignalLike } from '@azure/core-http';
import { ErrorProvider } from '../../providers/ErrorProvider';
import { CommunicationUiErrorInfo } from '../../types/CommunicationUiError';
import ErrorBar from '../../components/ErrorBar';

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
  messagesPerPage?: number; // Number of messages per page - smaller for better perf
  // supportNewline: boolean; // Whether to support new line (shift+enter) in textArea, disable until ACS backend supports line switch
};

export default (props: GroupChatProps): JSX.Element => {
  const { displayName, threadId, token, endpointUrl, options, onRenderAvatar, onErrorCallback } = props;
  const sendBoxParentStyle = mergeStyles({
    maxWidth: options?.sendBoxMaxLength ? `${options?.sendBoxMaxLength / 16}rem` : 'unset',
    width: '100%'
  });

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
        <Stack className={chatContainer} grow>
          <Stack className={chatWrapper} grow>
            <ChatThread onRenderAvatar={onRenderAvatar} messageNumberPerPage={options?.messagesPerPage} />
            <Stack.Item align="center" className={sendBoxParentStyle}>
              <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                <TypingIndicator />
              </div>
              <ErrorBar />
              <SendBox />
            </Stack.Item>
          </Stack>
        </Stack>
      </ChatProvider>
    </ErrorProvider>
  );
};

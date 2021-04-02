// © Microsoft Corporation. All rights reserved.
import { Stack } from '@fluentui/react';
import { mergeStyles } from '@fluentui/react';
import { ChatProvider } from '../../providers';
import React, { useMemo } from 'react';
import {
  SendBox as SendBoxComponent,
  TypingIndicator as TypingIndicatorComponent,
  ErrorBar as ErrorBarComponent,
  MessageThread,
  MessageThreadProps,
  SendBoxProps,
  TypingIndicatorProps
} from '../../components';
import { chatContainer, chatWrapper } from './styles/GroupChat.styles';
import { AbortSignalLike } from '@azure/core-http';
import { ErrorHandlingProps, ErrorProvider } from '../../providers/ErrorProvider';
import { CommunicationUiErrorInfo } from '../../types/CommunicationUiError';
import {
  connectFuncsToContext,
  MapToChatMessageProps,
  MapToErrorBarProps,
  MapToSendBoxProps,
  MapToTypingIndicatorProps,
  SendBoxPropsFromContext
} from '../../consumers';
import { WithErrorHandling } from '../../utils';

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
  const { displayName, threadId, token, endpointUrl, options, onRenderAvatar, onErrorCallback } = props;
  const sendBoxParentStyle = mergeStyles({
    maxWidth: options?.sendBoxMaxLength ? `${options?.sendBoxMaxLength / 16}rem` : 'unset',
    width: '100%'
  });

  const ChatThread = useMemo(() => {
    return connectFuncsToContext(
      (props: MessageThreadProps & ErrorHandlingProps) => WithErrorHandling(MessageThread, props),
      MapToChatMessageProps
    );
  }, []);
  const ErrorBar = useMemo(() => {
    return connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);
  }, []);
  const SendBox = useMemo(() => {
    return connectFuncsToContext(
      (props: SendBoxProps & SendBoxPropsFromContext & ErrorHandlingProps) =>
        WithErrorHandling(SendBoxComponent, props),
      MapToSendBoxProps
    );
  }, []);
  const TypingIndicator = useMemo(() => {
    return connectFuncsToContext(
      (props: TypingIndicatorProps & ErrorHandlingProps) => WithErrorHandling(TypingIndicatorComponent, props),
      MapToTypingIndicatorProps
    );
  }, []);

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
            <ChatThread onRenderAvatar={onRenderAvatar} />
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

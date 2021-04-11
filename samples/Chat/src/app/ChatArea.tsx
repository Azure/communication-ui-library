// © Microsoft Corporation. All rights reserved.

import {
  ErrorBar as ErrorBarComponent,
  SendBox as SendBoxComponent,
  TypingIndicator as TypingIndicatorComponent,
  MapToTypingIndicatorProps,
  MessageThread,
  connectFuncsToContext,
  MapToChatMessageProps,
  MapToErrorBarProps,
  MapToSendBoxProps,
  WithErrorHandling,
  MessageThreadProps,
  ErrorHandlingProps,
  SendBoxProps,
  TypingIndicatorProps,
  SendBoxPropsFromContext
} from '@azure/communication-ui';
import { Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { chatAreaContainerStyle, sendBoxParentStyle } from './styles/ChatArea.styles';

export interface ChatAreaProps {
  onRenderAvatar?: (userId: string) => JSX.Element;
}

export const ChatArea = (props: ChatAreaProps): JSX.Element => {
  const { onRenderAvatar } = props;
  const ChatThread = useMemo(() => {
    return connectFuncsToContext(
      (props: MessageThreadProps & ErrorHandlingProps) => WithErrorHandling(MessageThread, props),
      () => {
        return {
          ...MapToChatMessageProps(),
          onRenderAvatar: onRenderAvatar
        };
      }
    );
  }, [onRenderAvatar]);
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

  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatArea is to become a component or if Sample App is to move to composite
  return (
    <Stack className={chatAreaContainerStyle}>
      <ChatThread />
      <Stack.Item align="center" className={sendBoxParentStyle}>
        <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
          <TypingIndicator />
        </div>
        <ErrorBar />
        <SendBox />
      </Stack.Item>
    </Stack>
  );
};

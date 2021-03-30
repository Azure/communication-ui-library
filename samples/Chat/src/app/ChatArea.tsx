// © Microsoft Corporation. All rights reserved.

import {
  ErrorBarComponent,
  SendBoxComponent,
  TypingIndicatorComponent,
  MapToTypingIndicatorProps,
  ChatThreadComponent,
  connectFuncsToContext,
  MapToChatMessageProps,
  MapToErrorBarProps,
  MapToSendBoxProps,
  WithErrorHandling,
  ChatThreadComponentProps,
  ErrorHandlingProps,
  SendBoxComponentProps,
  TypingIndicatorComponentProps
} from '@azure/communication-ui';
import { Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { chatAreaContainerStyle, sendBoxParentStyle } from './styles/ChatArea.styles';

export interface ChatAreaProps {
  onRenderAvatar?: (userId: string) => JSX.Element;
}

export const ChatArea = (props: ChatAreaProps): JSX.Element => {
  const ChatThread = useMemo(() => {
    return connectFuncsToContext(
      (props: ChatThreadComponentProps & ErrorHandlingProps) => WithErrorHandling(ChatThreadComponent, props),
      MapToChatMessageProps
    );
  }, []);
  const ErrorBar = useMemo(() => {
    return connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);
  }, []);
  const SendBox = useMemo(() => {
    return connectFuncsToContext(
      (props: SendBoxComponentProps & ErrorHandlingProps) => WithErrorHandling(SendBoxComponent, props),
      MapToSendBoxProps
    );
  }, []);
  const TypingIndicator = useMemo(() => {
    return connectFuncsToContext(
      (props: TypingIndicatorComponentProps & ErrorHandlingProps) => WithErrorHandling(TypingIndicatorComponent, props),
      MapToTypingIndicatorProps
    );
  }, []);

  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatArea is to become a component or if Sample App is to move to composite
  return (
    <Stack className={chatAreaContainerStyle}>
      <ChatThread onRenderAvatar={props.onRenderAvatar} />
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

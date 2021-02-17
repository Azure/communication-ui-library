// © Microsoft Corporation. All rights reserved.

import { ChatThread, SendBox, TypingIndicator } from '@azure/communication-ui';
import { Stack } from '@fluentui/react';
import React from 'react';
import { chatAreaContainerStyle, sendBoxParentStyle } from './styles/ChatArea.styles';

export interface ChatAreaProps {
  onRenderAvatar?: (userId: string) => JSX.Element;
}

export default (props: ChatAreaProps): JSX.Element => {
  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatArea is to become a component or if Sample App is to move to composite
  return (
    <Stack className={chatAreaContainerStyle}>
      <ChatThread onRenderAvatar={props.onRenderAvatar} />
      <TypingIndicator />
      <Stack.Item align="center" className={sendBoxParentStyle}>
        <SendBox />
      </Stack.Item>
    </Stack>
  );
};

// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
import { chatScreenBottomContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { Stack } from '@fluentui/react';
import { onRenderAvatar } from './Avatar';
import {
  ChatThreadPropsFromContext,
  MapToChatThreadProps,
  connectFuncsToContext,
  ErrorsPropsFromContext,
  MapToErrorsProps,
  useThreadId
} from '@azure/communication-ui';
import { ChatHeader } from './ChatHeader';
import { ChatArea } from './ChatArea';
import { SidePanel, SidePanelTypes } from './SidePanel';
import { useSelector } from './hooks/useSelector';
import { chatHeaderSelector, chatParticipantListSelector } from '@azure/acs-chat-selector';
import { useHandlers } from './hooks/useHandlers';

// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  endChatHandler(): void;
  errorHandler(): void;
}

const ChatScreen = (props: ChatScreenProps & ChatThreadPropsFromContext & ErrorsPropsFromContext): JSX.Element => {
  // People pane will be visible when a chat is joined if the window width is greater than 600
  const [selectedPane, setSelectedPane] = useState(
    window.innerWidth > 600 ? SidePanelTypes.People : SidePanelTypes.None
  );

  const { errorHandler, getThreadMembersError } = props;

  useEffect(() => {
    document.getElementById('sendbox')?.focus();
  }, []);

  useEffect(() => {
    if (getThreadMembersError) {
      errorHandler();
    }
  }, [errorHandler, getThreadMembersError]);

  const chatHeaderProps = useSelector(chatHeaderSelector, { threadId: useThreadId() });
  const chatHeaderHandlers = useHandlers(ChatHeader);
  const chatParticipantProps = useSelector(chatParticipantListSelector, { threadId: useThreadId() });

  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatScreen is to become a component or if Sample App is to move to composite
  return (
    <Stack className={chatScreenContainerStyle}>
      <ChatHeader
        {...chatHeaderProps}
        {...chatHeaderHandlers}
        {...chatParticipantProps}
        endChatHandler={props.endChatHandler}
        selectedPane={selectedPane}
        setSelectedPane={setSelectedPane}
      />
      <Stack className={chatScreenBottomContainerStyle} horizontal={true}>
        <ChatArea onRenderAvatar={onRenderAvatar} />
        <Stack.Item grow disableShrink>
          <SidePanel setSelectedPane={setSelectedPane} selectedPane={selectedPane} onRenderAvatar={onRenderAvatar} />
        </Stack.Item>
      </Stack>
    </Stack>
  );
};

export default connectFuncsToContext(ChatScreen, MapToChatThreadProps, MapToErrorsProps);

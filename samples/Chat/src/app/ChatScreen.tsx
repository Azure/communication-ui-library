// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useRef, useState } from 'react';
import { chatScreenBottomContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { Stack } from '@fluentui/react';
import { onRenderAvatar } from './Avatar';
import { useChatClient, useChatThreadClient, useThreadId } from 'react-composites';
import { ChatHeader } from './ChatHeader';
import { ChatArea } from './ChatArea';
import { SidePanel, SidePanelTypes } from './SidePanel';
import { useSelector } from './hooks/useSelector';
import { chatParticipantListSelector } from '@azure/acs-chat-selector';
import { useHandlers } from './hooks/useHandlers';
import { chatHeaderSelector } from './selectors/chatHeaderSelector';

// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  endChatHandler(): void;
  errorHandler(): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { errorHandler, endChatHandler } = props;

  // People pane will be visible when a chat is joined if the window width is greater than 600
  const [selectedPane, setSelectedPane] = useState(
    window.innerWidth > 600 ? SidePanelTypes.People : SidePanelTypes.None
  );
  const isAllInitialParticipantsFetchedRef = useRef(false);

  const threadId = useThreadId();
  const chatClient = useChatClient();
  const chatThreadClient = useChatThreadClient();

  // Updates the thread state and populates attributes like topic, id, createdBy etc.
  useEffect(() => {
    chatClient.getChatThread(threadId);
    // eslint-disable-next-line
  }, []);

  // This code gets all participants who joined the chat earlier than the current user.
  // We need to do this to make the state in declaritive up to date.
  useEffect(() => {
    const fetchAllParticipants = async (): Promise<void> => {
      if (chatThreadClient !== undefined) {
        try {
          for await (const _page of chatThreadClient.listParticipants().byPage({
            // Fetch 100 participants per page by default.
            maxPageSize: 100
          }));
          isAllInitialParticipantsFetchedRef.current = true;
        } catch (e) {
          console.log(e);
          errorHandler();
        }
      }
    };

    fetchAllParticipants();
  }, [chatThreadClient, errorHandler]);

  useEffect(() => {
    document.getElementById('sendbox')?.focus();
  }, []);

  const chatHeaderProps = useSelector(chatHeaderSelector);
  const chatHeaderHandlers = useHandlers(ChatHeader);
  const chatParticipantProps = useSelector(chatParticipantListSelector);

  useEffect(() => {
    // We only want to check if we've fetched all the existing participants.
    if (isAllInitialParticipantsFetchedRef.current) {
      let isCurrentUserInChat = false;
      // Check if current user still in chat.
      for (let i = 0; i < chatParticipantProps.chatParticipants.length; i++) {
        if (chatParticipantProps.chatParticipants[i].userId === chatParticipantProps.userId) {
          isCurrentUserInChat = true;
          break;
        }
      }
      // If there is no match in the participant list, then the current user is no longer in the chat.
      !isCurrentUserInChat && errorHandler();
    }
  }, [chatParticipantProps.chatParticipants, chatParticipantProps.userId, errorHandler]);

  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatScreen is to become a component or if Sample App is to move to composite
  return (
    <Stack className={chatScreenContainerStyle}>
      <ChatHeader
        {...chatHeaderProps}
        {...chatHeaderHandlers}
        {...chatParticipantProps}
        endChatHandler={endChatHandler}
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

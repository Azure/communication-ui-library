// © Microsoft Corporation. All rights reserved.

import {
  useIsMessageSeen,
  useChatMessages,
  useFailedMessageIds,
  useThreadMembers,
  useSendReadReceipt,
  ChatMessageWithClientMessageId,
  PAGE_SIZE,
  PARTICIPANTS_THRESHOLD,
  useUserId,
  MessageStatus,
  ChatMessage as WebUiChatMessage,
  useSubscribeReadReceipt,
  useSubscribeMessage,
  useFetchMessages,
  useSetChatMessages
} from '@azure/communication-ui';
import { ChatMessage, ChatThreadMember } from '@azure/communication-chat';
import { useCallback, useEffect, useMemo } from 'react';
import { getLatestMessageId, updateMessagesWithAttached } from '../ChatThread';

const mockPreviousMessages = (): any[] => {
  return [
    {
      content: 'This is a past message',
      createdOn: new Date('2020-04-13T00:00:00.000+08:00'),
      id: '1615528414092',
      senderId: { sender: '8:acs:740e917b-1ae0-47aa-bc68-ae95600ba1e3_00000008-c4e0-b199-570c-113a0d0074666' },
      senderDisplayName: '11',
      status: 'delivered' as MessageStatus
    },
    {
      content: 'This is a past message2',
      createdOn: new Date('2020-04-13T00:00:00.000+08:00'),
      id: '1615528414092',
      senderId: { sender: '8:acs:740e917b-1ae0-47aa-bc68-ae95600ba1e3_00000008-c4e0-b199-570c-113a0d0074666' },
      senderDisplayName: '11',
      status: 'delivered' as MessageStatus
    }
  ];
};

const isLargeParticipantsGroup = (threadMembers: ChatThreadMember[]): boolean => {
  return threadMembers.length >= PARTICIPANTS_THRESHOLD;
};

export const getMessageStatus = (
  message: ChatMessageWithClientMessageId,
  messages: ChatMessage[],
  failedMessageIds: string[],
  isLargeParticipantsGroup: boolean,
  userId: string,
  isMessageSeen?: ((userId: string, messageId: string, messages: any[]) => boolean) | undefined
): MessageStatus => {
  // message is pending send or is failed to be sent
  if (message.createdOn === undefined) {
    const messageFailed: boolean =
      failedMessageIds.find((failedMessageId: string) => failedMessageId === message.clientMessageId) !== undefined;
    return messageFailed ? MessageStatus.FAILED : MessageStatus.SENDING;
  } else {
    if (message.id === undefined) return MessageStatus.DELIVERED;
    // show read receipt if it's not a large participant group
    if (!isLargeParticipantsGroup) {
      return isMessageSeen && isMessageSeen(userId, message.clientMessageId ?? '', messages)
        ? MessageStatus.SEEN
        : MessageStatus.DELIVERED;
    } else {
      return MessageStatus.DELIVERED;
    }
  }
};

/**
 * In order to display chat message on screen with all necessary components like message ordering, read receipt, failed
 * messages, etc., we need information from many different places in Chat SDK. But to provide a nice clean interface for
 * developers, we hide all of that by combining all different sources of info before passing it down as a prop to
 * ChatThread. This way we keep the Chat SDK parts internal and if developer wants to use this component with their own
 * data source, they only need to provide one stream of formatted WebUIChatMessage[] for ChatThread to be able to render
 * everything properly.
 *
 * @param chatMessages
 * @param failedMessageIds
 * @param isLargeGroup
 * @param userId
 * @param isMessageSeen
 */
const convertSdkChatMessagesToWebUiChatMessages = (
  chatMessages: ChatMessageWithClientMessageId[],
  failedMessageIds: string[],
  isLargeGroup: boolean,
  userId: string,
  isMessageSeen: (userId: string, clientMessageId: string, messages: any[]) => boolean
): WebUiChatMessage[] => {
  return (
    chatMessages?.map<WebUiChatMessage>((chatMessage: ChatMessageWithClientMessageId) => {
      return {
        messageId: chatMessage.id,
        content: chatMessage.content,
        createdOn: chatMessage.createdOn,
        senderId: chatMessage.sender?.communicationUserId,
        senderDisplayName: chatMessage.senderDisplayName,
        status: getMessageStatus(chatMessage, chatMessages, failedMessageIds, isLargeGroup, userId, isMessageSeen)
      };
    }) ?? []
  );
};

export type ChatMessagePropsFromContext = {
  userId: string;
  chatMessages: WebUiChatMessage[];
  disableReadReceipt: boolean;
  sendReadReceipt: (messageId: string) => Promise<void>;
  latestSeenMessageId?: string;
  latestMessageId?: string;
  onRenderMorePreviousMessages: () => void;
};

export const MapToChatMessageProps = (): ChatMessagePropsFromContext => {
  useSubscribeReadReceipt();
  useSubscribeMessage();
  const sdkChatMessages = useChatMessages();
  const failedMessageIds = useFailedMessageIds();
  const threadMembers = useThreadMembers();
  const isMessageSeen = useIsMessageSeen();
  const userId = useUserId();
  const isLargeGroup = useMemo(() => {
    return isLargeParticipantsGroup(threadMembers);
  }, [threadMembers]);
  const setChatMessages = useSetChatMessages();
  const sendReadReceipt = useSendReadReceipt();
  const originalChatMessages = useMemo(() => {
    return convertSdkChatMessagesToWebUiChatMessages(
      sdkChatMessages ?? [],
      failedMessageIds,
      isLargeGroup,
      userId,
      isMessageSeen
    );
  }, [failedMessageIds, isLargeGroup, isMessageSeen, sdkChatMessages, userId]);

  const chatMessages = useMemo(() => {
    return updateMessagesWithAttached(
      originalChatMessages ?? [],
      0,
      userId,
      failedMessageIds,
      isLargeGroup,
      isMessageSeen
    );
  }, [originalChatMessages, userId, isMessageSeen, isLargeGroup, failedMessageIds]);

  const latestMessageId = useMemo(() => {
    return getLatestMessageId(chatMessages, userId);
  }, [chatMessages, userId]);

  const latestSeenMessageId = useMemo(() => {
    return getLatestMessageId(chatMessages, userId, true);
  }, [chatMessages, userId]);

  const fetchMessages = useFetchMessages();
  useEffect(() => {
    fetchMessages({ maxPageSize: PAGE_SIZE });
  }, [fetchMessages]);

  const onRenderMorePreviousMessages = useCallback(() => {
    setChatMessages(mockPreviousMessages().concat(sdkChatMessages));
  }, [sdkChatMessages, setChatMessages]);

  return {
    userId: userId,
    chatMessages: chatMessages,
    disableReadReceipt: isLargeGroup,
    sendReadReceipt: sendReadReceipt,
    latestMessageId: latestMessageId,
    latestSeenMessageId: latestSeenMessageId,
    onRenderMorePreviousMessages: onRenderMorePreviousMessages
  };
};

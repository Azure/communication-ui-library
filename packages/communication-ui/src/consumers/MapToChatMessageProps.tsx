// © Microsoft Corporation. All rights reserved.

import { useIsMessageSeen } from '../hooks/useIsMessageSeen';
import { ChatMessage, ChatThreadMember } from '@azure/communication-chat';
import { useChatMessages, useFailedMessageIds, useThreadMembers } from '../providers/ChatThreadProvider';

import { useSendReadReceipt } from '../hooks/useSendReadReceipt';
import { ChatMessageWithClientMessageId } from '../hooks/useSendMessage';
import { PAGE_SIZE, PARTICIPANTS_THRESHOLD } from '../constants';
import { useUserId } from '../providers/ChatProvider';
import { MessageStatus } from '../types/ChatMessage';
import { ChatMessage as WebUiChatMessage } from '../types/ChatMessage';
import { useSubscribeReadReceipt } from '../hooks/useSubscribeReadReceipt';
import { useSubscribeMessage } from '../hooks/useSubscribeMessage';
import { useFetchMessages } from '../hooks/useFetchMessages';
import { useEffect, useMemo } from 'react';

const isLargeParticipantsGroup = (threadMembers: ChatThreadMember[]): boolean => {
  return threadMembers.length >= PARTICIPANTS_THRESHOLD;
};

const getMessageStatus = (
  message: ChatMessageWithClientMessageId,
  messages: ChatMessage[],
  failedMessageIds: string[],
  isLargeParticipantsGroup: boolean,
  userId: string,
  isMessageSeen?: ((userId: string, message: WebUiChatMessage) => boolean) | undefined
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
      return isMessageSeen && isMessageSeen(userId, message) ? MessageStatus.SEEN : MessageStatus.DELIVERED;
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
  isMessageSeen: (userId: string, message: WebUiChatMessage) => boolean
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

type ChatMessagePropsFromContext = {
  userId: string;
  chatMessages: WebUiChatMessage[];
  disableReadReceipt: boolean;
  sendReadReceipt: (messageId: string) => Promise<void>;
};

export const MapToChatMessageProps = (): ChatMessagePropsFromContext => {
  useSubscribeReadReceipt();
  useSubscribeMessage();
  const sdkChatMessages = useChatMessages();
  const failedMessageIds = useFailedMessageIds();
  const threadMembers = useThreadMembers();
  const isMessageSeen = useIsMessageSeen();
  const userId = useUserId();
  const isLargeGroup = isLargeParticipantsGroup(threadMembers);
  const chatMessages = useMemo(() => {
    return convertSdkChatMessagesToWebUiChatMessages(
      sdkChatMessages ?? [],
      failedMessageIds,
      isLargeGroup,
      userId,
      isMessageSeen
    );
  }, [failedMessageIds, isLargeGroup, isMessageSeen, sdkChatMessages, userId]);

  const fetchMessages = useFetchMessages();
  useEffect(() => {
    fetchMessages({ maxPageSize: PAGE_SIZE });
  }, [fetchMessages]);

  return {
    userId: userId,
    chatMessages: chatMessages,
    disableReadReceipt: isLargeGroup,
    sendReadReceipt: useSendReadReceipt()
  };
};

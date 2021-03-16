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
  compareMessages
} from '@azure/communication-ui';
import { ChatMessage, ChatThreadMember } from '@azure/communication-chat';
import { useEffect, useMemo } from 'react';

export const updateMessagesWithAttached = (
  chatMessagesWithStatus: any[],
  indexOfTheFirstMessage: number,
  userId: string
): WebUiChatMessage[] => {
  chatMessagesWithStatus.sort(compareMessages);
  const newChatMessages: WebUiChatMessage[] = [];
  const messagesToRender = chatMessagesWithStatus.slice(indexOfTheFirstMessage, chatMessagesWithStatus.length);
  messagesToRender.map((message: any, index: number, messagesList: any) => {
    const mine = message.senderId === userId;
    let attached: string | boolean = false;
    if (index === 0) {
      if (index !== messagesList.length - 1) {
        //the next message has the same sender
        if (messagesList[index].senderId === messagesList[index + 1].senderId) {
          attached = 'top';
        }
      }
    } else {
      if (messagesList[index].senderId === messagesList[index - 1].senderId) {
        //the previous message has the same sender
        if (index !== messagesList.length - 1) {
          if (messagesList[index].senderId === messagesList[index + 1].senderId) {
            //the next message has the same sender
            attached = true;
          } else {
            //the next message has a different sender
            attached = 'bottom';
          }
        } else {
          // this is the last message of the whole messages list
          attached = 'bottom';
        }
      } else {
        //the previous message has a different sender
        if (index !== messagesList.length - 1) {
          if (messagesList[index].senderId === messagesList[index + 1].senderId) {
            //the next message has the same sender
            attached = 'top';
          }
        }
      }
    }
    const messageWithAttached = { ...message, attached, mine };
    newChatMessages.push(messageWithAttached);
    return message;
  });
  return newChatMessages;
};

export const getLatestMessageId = (
  chatMessageWithStatus: WebUiChatMessage[],
  userId: string,
  isLatestSeen = false, // set it to true to get latest message being seen
  latestIncoming = false // set it to true to get latest message for others
): string | undefined => {
  const lastSeenChatMessage = chatMessageWithStatus
    .filter(
      (message) =>
        message.createdOn &&
        (message.status === MessageStatus.SEEN || !isLatestSeen) &&
        latestIncoming !== (message.senderId === userId)
    )
    .map((message) => ({ createdOn: message.createdOn, id: message.messageId }))
    .reduce(
      (message1, message2) => {
        if (!message1.createdOn || !message2.createdOn) {
          return message1.createdOn ? message1 : message2;
        } else {
          return compareMessages(message1, message2) > 0 ? message1 : message2;
        }
      },
      { createdOn: undefined, id: undefined }
    );
  return lastSeenChatMessage.id;
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

const isLargeParticipantsGroup = (threadMembers: ChatThreadMember[]): boolean => {
  return threadMembers.length >= PARTICIPANTS_THRESHOLD;
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
  latestIncomingMessageId?: string;
  loadMorePreviousMessages?: () => void;
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
    return updateMessagesWithAttached(originalChatMessages ?? [], 0, userId);
  }, [originalChatMessages, userId]);

  const latestMessageId = useMemo(() => {
    return getLatestMessageId(chatMessages, userId);
  }, [chatMessages, userId]);

  const latestSeenMessageId = useMemo(() => {
    return getLatestMessageId(chatMessages, userId, true);
  }, [chatMessages, userId]);

  const latestIncomingMessageId = useMemo(() => {
    return getLatestMessageId(chatMessages, userId, false, true);
  }, [chatMessages, userId]);

  const fetchMessages = useFetchMessages();
  useEffect(() => {
    fetchMessages({ maxPageSize: PAGE_SIZE });
  }, [fetchMessages]);

  return {
    userId: userId,
    chatMessages: chatMessages,
    disableReadReceipt: isLargeGroup,
    sendReadReceipt: sendReadReceipt,
    latestMessageId: latestMessageId,
    latestSeenMessageId: latestSeenMessageId,
    latestIncomingMessageId: latestIncomingMessageId
  };
};

// © Microsoft Corporation. All rights reserved.

import {
  useChatMessages,
  useFailedMessageIds,
  useThreadMembers,
  useSendReadReceipt,
  ChatMessageWithClientMessageId,
  PAGE_SIZE,
  PARTICIPANTS_THRESHOLD,
  useUserId,
  MessageStatus,
  useIsMessageSeen,
  ChatMessage as WebUiChatMessage,
  useSubscribeReadReceipt,
  useSubscribeMessage,
  useFetchMessages,
  compareMessages
} from '@azure/communication-ui';
import { ChatMessage, ChatThreadMember } from '@azure/communication-chat';
import { useCallback, useEffect, useMemo } from 'react';

export const updateMessagesWithAttached = (
  chatMessagesWithStatus: WebUiChatMessage[],
  userId: string,
  failedMessageIds: string[],
  isLargeGroup: boolean,
  isMessageSeen: (userId: string, message: WebUiChatMessage) => boolean
): WebUiChatMessage[] => {
  /**
   * A block of messages: continuous messages that belong to the same sender and not intercepted by other senders.
   *
   * This is the index of the last message in the previous block of messages that are mine.
   * This message's status will be reset when there's a new block of messages that are mine. (Because
   * in this case, we only want to show the read status of last message of the new messages block)
   */
  let IndexOfMyLastMassage: number | undefined = undefined;
  const newChatMessages: WebUiChatMessage[] = [];

  chatMessagesWithStatus.sort(compareMessages);
  chatMessagesWithStatus.map((message: any, index: number, messagesList: any) => {
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

    let status = undefined;
    if (mine) {
      status = getMessageStatus(message, failedMessageIds, isLargeGroup, userId, isMessageSeen);

      // Clean the status of the previous message in the same message block of mine.
      if (newChatMessages.length > 0) {
        const prevMsg = newChatMessages[newChatMessages.length - 1];
        if (prevMsg.status === status || prevMsg.status === 'failed') {
          prevMsg.status = undefined;
        }
      }

      // If there's a previous block of messages that are mine, clean the read status on the last message
      if (IndexOfMyLastMassage) {
        newChatMessages[IndexOfMyLastMassage].status = undefined;
        IndexOfMyLastMassage = undefined;
      }

      // Update IndexOfMyLastMassage to be the index of last message in this block.
      if (messagesList[index + 1]?.senderId !== userId) {
        IndexOfMyLastMassage = index;
      }
    }

    const messageWithAttached = { ...message, attached, mine, status };
    newChatMessages.push(messageWithAttached);
    return message;
  });
  return newChatMessages;
};

export const getLatestIncomingMessageId = (chatMessages: WebUiChatMessage[], userId: string): string | undefined => {
  const lastSeenChatMessage = chatMessages
    .filter((message) => message.createdOn && message.senderId !== userId)
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
  message: WebUiChatMessage,
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
    if (message.messageId === undefined) return MessageStatus.DELIVERED;
    // show read receipt if it's not a large participant group
    if (!isLargeParticipantsGroup) {
      return isMessageSeen && isMessageSeen(userId, message) ? MessageStatus.SEEN : MessageStatus.DELIVERED;
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
  isMessageSeen: (userId: string, message: WebUiChatMessage) => boolean
): WebUiChatMessage[] => {
  const convertedChatMessages =
    chatMessages?.map<WebUiChatMessage>((chatMessage: ChatMessageWithClientMessageId) => {
      return {
        messageId: chatMessage.id,
        content: chatMessage.content,
        createdOn: chatMessage.createdOn,
        senderId: chatMessage.sender?.communicationUserId,
        senderDisplayName: chatMessage.senderDisplayName,
        clientMessageId: chatMessage.clientMessageId
      };
    }) ?? [];
  return updateMessagesWithAttached(convertedChatMessages ?? [], userId, failedMessageIds, isLargeGroup, isMessageSeen);
};

export type ChatMessagePropsFromContext = {
  userId: string;
  chatMessages: WebUiChatMessage[];
  disableReadReceipt: boolean;
  onSendReadReceipt: () => Promise<void>;
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
  const chatMessages = useMemo(() => {
    return convertSdkChatMessagesToWebUiChatMessages(
      sdkChatMessages ?? [],
      failedMessageIds,
      isLargeGroup,
      userId,
      isMessageSeen
    );
  }, [failedMessageIds, isLargeGroup, isMessageSeen, sdkChatMessages, userId]);

  const onSendReadReceipt = useCallback(async () => {
    const messageId = getLatestIncomingMessageId(chatMessages, userId);
    await sendReadReceipt(messageId ?? '');
  }, [chatMessages, userId]);

  const fetchMessages = useFetchMessages();
  useEffect(() => {
    fetchMessages({ maxPageSize: PAGE_SIZE });
  }, [fetchMessages]);

  return {
    userId: userId,
    chatMessages: chatMessages,
    disableReadReceipt: isLargeGroup,
    onSendReadReceipt
  };
};

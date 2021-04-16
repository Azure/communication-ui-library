// © Microsoft Corporation. All rights reserved.
import { getChatMessages, getIsLargeGroup, getLatestReadTime, getUserId } from './baseSelectors';
import { ChatMessageWithStatus, MessageStatus } from '@azure/acs-chat-declarative';
import { createSelector } from 'reselect';
import { compareMessages } from './utils/compareMessages';
// The following need explicitly imported to avoid api-extractor issues.
// These can be removed once https://github.com/microsoft/rushstack/pull/1916 is fixed.
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { ChatMessageContent, ChatParticipant } from '@azure/communication-chat';
// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseSelectorProps } from './baseSelectors';
// @ts-ignore
import { ChatMessage, MessageAttachedStatus, Message } from './types/UiChatMessage';

export const chatThreadSelector = createSelector(
  [getUserId, getChatMessages, getLatestReadTime, getIsLargeGroup],
  (userId, chatMessages, latestReadTime, isLargeGroup) => {
    // A function takes parameter above and generate return value
    const chatMessagesWithStatus: ChatMessage[] = Array.from(chatMessages.values()).map(
      (chatMessage: ChatMessageWithStatus) => ({
        type: 'chat',
        payload: {
          createdOn: chatMessage.createdOn,
          content: chatMessage.content?.message,
          status:
            !isLargeGroup && chatMessage.status === 'delivered' && chatMessage.createdOn < latestReadTime
              ? 'seen'
              : chatMessage.status,
          senderDisplayName: chatMessage.senderDisplayName,
          senderId: chatMessage.sender?.communicationUserId || userId,
          messageId: chatMessage.id,
          clientMessageId: chatMessage.clientMessageId,
          statusToRender: chatMessage.status === 'failed' ? 'failed' : undefined
        }
      })
    );

    updateMessagesWithAttached(chatMessagesWithStatus, userId, isLargeGroup);
    return {
      userId,
      disableReadReceipt: false,
      messages: chatMessagesWithStatus
    };
  }
);

// we only attach statusToRender to the last message with matched status
const attachLastStatusToRender = (messages: ChatMessage[], status: MessageStatus): void => {
  const messagesToFind = messages.filter((message) => message.payload.mine && message.payload.status === status);
  const lastMessageWithStatus = messagesToFind[messagesToFind.length - 1];
  if (messagesToFind.length > 0) {
    lastMessageWithStatus.payload.statusToRender = lastMessageWithStatus.payload.status;
  }
};

export const updateMessagesWithAttached = (
  chatMessagesWithStatus: ChatMessage[],
  userId: string,
  isLargeGroup: boolean
): void => {
  chatMessagesWithStatus.sort(compareMessages);

  chatMessagesWithStatus.forEach((message, index, messages) => {
    const mine = message.payload.senderId === userId;
    /**
     * A block of messages: continuous messages that belong to the same sender and not intercepted by other senders.
     *
     * Attacthed is the index of the last message in the previous block of messages which mine===true.
     * This message's statusToRender will be reset when there's a new block of messages which mine===true. (Because
     * in this case, we only want to show the read statusToRender of last message of the new messages block)
     */
    let attached: boolean | MessageAttachedStatus = false;
    if (index === 0) {
      if (index !== messages.length - 1) {
        //the next message has the same sender
        if (messages[index].payload.senderId === messages[index + 1].payload.senderId) {
          attached = MessageAttachedStatus.TOP;
        }
      }
    } else {
      if (messages[index].payload.senderId === messages[index - 1].payload.senderId) {
        //the previous message has the same sender
        if (index !== messages.length - 1) {
          if (messages[index].payload.senderId === messages[index + 1].payload.senderId) {
            //the next message has the same sender
            attached = true;
          } else {
            //the next message has a different sender
            attached = MessageAttachedStatus.BOTTOM;
          }
        } else {
          // this is the last message of the whole messages list
          attached = MessageAttachedStatus.BOTTOM;
        }
      } else {
        //the previous message has a different sender
        if (index !== messages.length - 1) {
          if (messages[index].payload.senderId === messages[index + 1].payload.senderId) {
            //the next message has the same sender
            attached = MessageAttachedStatus.TOP;
          }
        }
      }
    }
    message.payload.attached = attached;
    message.payload.mine = mine;
  });

  attachLastStatusToRender(chatMessagesWithStatus, 'delivered');
  attachLastStatusToRender(chatMessagesWithStatus, 'sending');

  if (!isLargeGroup) {
    attachLastStatusToRender(chatMessagesWithStatus, 'seen');
  }
};

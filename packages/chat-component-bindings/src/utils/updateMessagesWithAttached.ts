// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Message, MessageAttachedStatus } from '@internal/react-components';
import { compareMessages } from './compareMessages';

/**
 * @private
 */
export const updateMessagesWithAttached = (chatMessagesWithStatus: Message[], userId: string): void => {
  chatMessagesWithStatus.sort(compareMessages);

  chatMessagesWithStatus.forEach((message, index, messages) => {
    if (message.messageType !== 'chat') {
      return;
    }
    /**
     * Attached === true means it is within a group of messages in the current order
     * Attached === top/bottom means it is on the top/bottom boundary
     * Attached === false means it is just a single message
     * A group of messages: continuous messages that belong to the same sender and not intercepted by other senders.
     */
    let attached: boolean | MessageAttachedStatus = false;
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    const nextMessage = index === messages.length - 1 ? undefined : messages[index + 1];

    const previousSenderId = previousMessage?.messageType === 'chat' ? previousMessage.senderId : undefined;
    const nextSenderId = nextMessage?.messageType === 'chat' ? nextMessage.senderId : undefined;

    if (previousSenderId !== message.senderId) {
      attached = message.senderId === nextSenderId ? 'top' : false;
    } else {
      attached = message.senderId === nextSenderId ? true : 'bottom';
    }

    message.attached = attached;
  });
};

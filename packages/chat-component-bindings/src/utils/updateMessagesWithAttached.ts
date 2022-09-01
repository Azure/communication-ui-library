// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Message, MessageAttachedStatus } from '@internal/react-components';
import { compareMessages } from './compareMessages';

/**
 * @private
 */
export const updateMessagesWithAttached = (chatMessagesWithStatus: Message[]): void => {
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

    const timediff =
      new Date(message?.createdOn ?? '').getTime() - new Date(previousMessage?.createdOn ?? '').getTime();

    const diffMins = Math.round(timediff / 1000 / 60); // minutes

    if (previousSenderId !== message.senderId) {
      attached = message.senderId === nextSenderId ? 'top' : false;
    } // if there are more than or equal to 5 mins time gap between messages do not attach and show time stamp
    else if (diffMins && diffMins >= 5) {
      attached = false;
    } else {
      attached = message.senderId === nextSenderId ? true : 'bottom';
    }

    message.attached = attached;
  });
};

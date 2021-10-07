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
    const mine = message.senderId === userId;
    /**
     * A block of messages: continuous messages that belong to the same sender and not intercepted by other senders.
     *
     * Attacthed is the index of the last message in the previous block of messages which mine===true.
     * This message's statusToRender will be reset when there's a new block of messages which mine===true. (Because
     * in this case, we only want to show the read statusToRender of last message of the new messages block)
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
    message.mine = mine;
  });
};

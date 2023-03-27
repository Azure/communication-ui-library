// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatMessage, ReadReceiptsBySenderId } from '../..';

/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../..';

/**
 * @private
 *logic: Looking at message A, how do we know it's read number?
 * Assumption: if user read the latest message, user has read all messages before that
 * ReadReceipt behaviour: read receipt is only sent to the last message
 *
 * If participant read a message that is sent later than message A, then the participant has read message A
 * How do we check if the message is sent later than message A?
 * We compare if the messageID of the last read message is larger than or equal to the message A's id
 * Because messageID is the creation timestamp of each message
 * Timestamps are in epoch time so lecixographical ordering is the same as time ordering.
 *
 * if MessageId of B is larger than message Id of A, then B is created after A
 * if the last read message is created after the message A is sent, then user should have read message A as well */
export const getParticipantsWhoHaveReadMessage = (
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage,
  readReceiptsBySenderId: ReadReceiptsBySenderId
): { id: string; displayName: string }[] => {
  return (
    Object.entries(readReceiptsBySenderId)
      // Filter to only read receipts that match the message OR the participant has read a different message after this message has been created
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, readReceipt]) => readReceipt.lastReadMessage >= message.messageId)
      // make sure the person is not removed from chat
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, readReceipt]) => readReceipt.displayName && readReceipt.displayName !== '')
      // Map properties to useful array
      .map(([id, readReceipt]) => ({ id, displayName: readReceipt.displayName }))
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatMessageWithStatus } from '@internal/chat-stateful-client';

/**
 * @private
 *logic: Looking at message A, how do we know it's read number?
 * Assumption: if user read the latest message, user has read all messages before that
 * ReadReceipt behaviour: read receipt is only sent to the last message
 * if participant read a message that is sent later than message A, then the participant has read message A
 * how do we check if the message is sent later than message A?
 * we compare if the readon timestamp is later than the message A sent time
 * if last read message id is not equal to message A's id, check the read on time stamp.
 * if the last read message is read after the message A is sent, then user should have read message A as well */
export const getParticipantsWhoHaveReadMessage = (
  message: ChatMessageWithStatus,
  readReceiptForEachSender: { [key: string]: { lastReadMessage: string; readOn: Date; name: string } }
): { id: string; name: string }[] => {
  return (
    Object.entries(readReceiptForEachSender)
      // Filter to only read receipts that match the message OR the participant has read a different message after this message has been created
      .filter(
        ([_, readReceipt]) =>
          readReceipt.lastReadMessage === message.id || new Date(readReceipt.readOn) >= new Date(message.createdOn)
      )
      // Map properties to useful array
      .map(([id, readReceipt]) => ({ id, name: readReceipt.name }))
  );
};

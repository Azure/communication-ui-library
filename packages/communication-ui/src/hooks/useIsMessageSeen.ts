// © Microsoft Corporation. All rights reserved.

import { useCallback } from 'react';

import { useReceipts } from '../providers/ChatThreadProvider';

export const useIsMessageSeen = (): ((userId: string, clientMessageId: string, messages: any[]) => boolean) => {
  const receipts = useReceipts();

  const internal = useCallback(
    (userId: string, clientMessageId: string, messages: any[]): boolean => {
      if (!receipts || receipts.length === 0) {
        return false;
      }
      const message = messages.find((message) => message.clientMessageId === clientMessageId);
      const latestArrivalTime: any = message ? message.createdOn : -1;

      const numSeen = receipts?.filter((receipt) => {
        if ((receipt.sender?.communicationUserId as string) === userId) {
          //don't count sender's own read receipt
          return false;
        }
        const readMessagecreatedOn = messages.find((message) => message.id === receipt.chatMessageId)?.createdOn;
        return new Date(readMessagecreatedOn) >= new Date(latestArrivalTime);
      }).length;
      return numSeen > 0 ? true : false;
    },
    [receipts]
  );

  return internal;
};

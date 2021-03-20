// © Microsoft Corporation. All rights reserved.

import { useCallback } from 'react';

import { useReceipts } from '../providers/ChatThreadProvider';
import { ChatMessage as WebUiChatMessage } from '../types';

export const useIsMessageSeen = (): ((userId: string, message: WebUiChatMessage) => boolean) => {
  const receipts = useReceipts();

  const internal = useCallback(
    (userId: string, message: WebUiChatMessage): boolean => {
      if (!receipts || receipts.length === 0) {
        return false;
      }

      const numSeen = receipts?.filter((receipt) => {
        if ((receipt.sender?.communicationUserId as string) === userId) {
          //don't count sender's own read receipt
          return false;
        }
        return new Date(receipt.readOn ?? -1) >= new Date(message.createdOn ?? -1);
      }).length;
      return numSeen > 0 ? true : false;
    },
    [receipts]
  );

  return internal;
};

// © Microsoft Corporation. All rights reserved.

import { ChatMessageReadReceipt } from '@azure/communication-chat';
import { useCallback } from 'react';
import {
  CommunicationUiErrorCode,
  CommunicationUiError,
  CommunicationUiErrorSeverity
} from '../types/CommunicationUiError';
import { useChatThreadClient } from '../providers/ChatThreadProvider';

export const useFetchReadReceipts = (): (() => Promise<ChatMessageReadReceipt[]>) => {
  const chatThreadClient = useChatThreadClient();
  if (chatThreadClient === undefined) {
    throw new CommunicationUiError({
      message: 'ChatThreadClient is undefined',
      code: CommunicationUiErrorCode.CONFIGURATION_ERROR,
      severity: CommunicationUiErrorSeverity.IGNORE
    });
  }
  const fetchReadReceipts = useCallback(async (): Promise<ChatMessageReadReceipt[]> => {
    const receipts: ChatMessageReadReceipt[] = [];
    try {
      for await (const page of chatThreadClient.listReadReceipts().byPage()) {
        for (const receipt of page) {
          receipts.push(receipt);
        }
      }
    } catch (error) {
      throw new CommunicationUiError({
        message: 'Error getting read receipts',
        code: CommunicationUiErrorCode.GET_READ_RECEIPT_ERROR,
        severity: CommunicationUiErrorSeverity.IGNORE,
        error: error
      });
    }

    return receipts;
  }, [chatThreadClient]);
  return fetchReadReceipts;
};

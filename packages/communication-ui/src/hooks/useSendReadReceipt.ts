// © Microsoft Corporation. All rights reserved.
import { ChatThreadClient, SendReadReceiptRequest } from '@azure/communication-chat';
import { useCallback } from 'react';
import {
  CommunicationUiErrorCode,
  CommunicationUiError,
  CommunicationUiErrorSeverity
} from '../types/CommunicationUiError';
import { useChatThreadClient } from '../providers/ChatThreadProvider';
import { getErrorFromAcsResponseCode } from '../utils/SDKUtils';

export const useSendReadReceipt = (): ((messageId: string) => Promise<void>) => {
  const chatThreadClient: ChatThreadClient | undefined = useChatThreadClient();
  const sendReadReceipt = useCallback(
    async (messageId: string): Promise<void> => {
      if (chatThreadClient === undefined) {
        // Read receipts aren't critical so we set the severity to IGNORE.
        throw new CommunicationUiError({
          message: 'ChatThreadClient is undefined',
          code: CommunicationUiErrorCode.CONFIGURATION_ERROR,
          severity: CommunicationUiErrorSeverity.IGNORE
        });
      }
      const postReadReceiptRequest: SendReadReceiptRequest = {
        chatMessageId: messageId
      };
      let response;
      try {
        response = await chatThreadClient.sendReadReceipt(postReadReceiptRequest);
      } catch (error) {
        throw new CommunicationUiError({
          message: 'Error sending read receipt',
          code: CommunicationUiErrorCode.SEND_READ_RECEIPT_ERROR,
          severity: CommunicationUiErrorSeverity.IGNORE,
          error: error
        });
      }
      const error = getErrorFromAcsResponseCode('Error sending read receipt, status code ', response._response.status);
      if (error) {
        // Read receipts aren't critical so we set the severity to IGNORE.
        error.severity = CommunicationUiErrorSeverity.IGNORE;
        throw error;
      }
    },
    [chatThreadClient]
  );
  return sendReadReceipt;
};

// © Microsoft Corporation. All rights reserved.

import { ChatThreadClient } from '@azure/communication-chat';
import { useCallback } from 'react';
import {
  CommunicationUiErrorCode,
  CommunicationUiError,
  CommunicationUiErrorSeverity
} from '../types/CommunicationUiError';
import { useChatThreadClient } from '../providers/ChatThreadProvider';

export const useSendTypingNotification = (): (() => Promise<boolean>) => {
  const chatThreadClient: ChatThreadClient | undefined = useChatThreadClient();
  const sendTypingNotification = useCallback(async (): Promise<boolean> => {
    if (chatThreadClient === undefined) {
      // Typing notifications aren't critical so we set the severity to IGNORE.
      throw new CommunicationUiError({
        message: 'ChatThreadClient is undefined',
        code: CommunicationUiErrorCode.CONFIGURATION_ERROR,
        severity: CommunicationUiErrorSeverity.IGNORE
      });
    }
    try {
      return await chatThreadClient.sendTypingNotification();
    } catch (error) {
      throw new CommunicationUiError({
        message: 'Error sending typing notification',
        code: CommunicationUiErrorCode.SEND_TYPING_NOTIFICATION_ERROR,
        severity: CommunicationUiErrorSeverity.IGNORE,
        error: error
      });
    }
  }, [chatThreadClient]);
  return sendTypingNotification;
};

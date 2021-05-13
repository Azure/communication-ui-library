// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorBarProps } from 'react-components';
import { CommunicationUiErrorCode, CommunicationUiErrorSeverity } from '../types/CommunicationUiError';
import { useLastError, useSetLastError } from '../providers/ErrorProvider';

/**
 * Map of CommunicationUiErrorCode to user friendly message. ErrorBar will use this to display the appropriate message
 * for the received error. Note if a CommunicationUiErrorCode is not configured in the map then we'll display a default
 * error message.
 */
const errorCodeToMessage = new Map<CommunicationUiErrorCode, string>([
  [CommunicationUiErrorCode.UNKNOWN_ERROR, 'An unknown error occurred.'],
  [CommunicationUiErrorCode.CONFIGURATION_ERROR, 'A configuration error occurred.'],
  [CommunicationUiErrorCode.UNAUTHORIZED_ERROR, 'Request is not authorized.'],
  [CommunicationUiErrorCode.FORBIDDEN_ERROR, 'User is not allowed to perform specified action.'],
  [CommunicationUiErrorCode.TOO_MANY_REQUESTS_ERROR, 'Too many requests. Try again later.'],
  [CommunicationUiErrorCode.SERVICE_UNAVAILABLE_ERROR, 'The server is currently unable to handle the request.'],
  [CommunicationUiErrorCode.INTERNAL_SERVER_ERROR, 'Unexpected error occurred processing the request.'],
  [CommunicationUiErrorCode.UNKNOWN_STATUS_CODE_ERROR, 'Server responded with an unknown status code.'],
  [CommunicationUiErrorCode.MESSAGE_EXCEEDED_RETRY_ERROR, 'Failed at sending message and reached max retry count'],
  [CommunicationUiErrorCode.START_REALTIME_NOTIFICATIONS_ERROR, 'Failed to subscribe to realtime notifications'],
  [CommunicationUiErrorCode.CREATE_CHAT_THREAD_CLIENT_ERROR, 'Failed to start chat'],
  [CommunicationUiErrorCode.SEND_READ_RECEIPT_ERROR, 'Failed to send read receipt'],
  [CommunicationUiErrorCode.SEND_MESSAGE_ERROR, 'Failed to send message'],
  [CommunicationUiErrorCode.GET_MESSAGE_ERROR, 'Failed to get message'],
  [CommunicationUiErrorCode.SEND_TYPING_NOTIFICATION_ERROR, 'Failed to send typing notification'],
  [CommunicationUiErrorCode.GET_MESSAGES_ERROR, 'Failed to get messages'],
  [CommunicationUiErrorCode.REMOVE_THREAD_MEMBER_ERROR, 'Failed to remove thread participant'],
  [CommunicationUiErrorCode.UPDATE_THREAD_ERROR, 'Failed to update thread'],
  [CommunicationUiErrorCode.GET_THREAD_ERROR, 'Failed to get thread'],
  [CommunicationUiErrorCode.QUERY_PERMISSIONS_ERROR, 'Failed to query for permissions'],
  [CommunicationUiErrorCode.ASK_PERMISSIONS_ERROR, 'Failed to ask for permissions'],
  [CommunicationUiErrorCode.SWITCH_VIDEO_SOURCE_ERROR, 'Failed to switch local video source'],
  [CommunicationUiErrorCode.UNMUTE_ERROR, 'Failed to unmute microphone'],
  [CommunicationUiErrorCode.MUTE_ERROR, 'Failed to mute microphone'],
  [CommunicationUiErrorCode.START_VIDEO_ERROR, 'Failed to start local video'],
  [CommunicationUiErrorCode.STOP_VIDEO_ERROR, 'Failed to stop local video'],
  [CommunicationUiErrorCode.START_SCREEN_SHARE_ERROR, 'Failed to start screenshare'],
  [CommunicationUiErrorCode.STOP_SCREEN_SHARE_ERROR, 'Failed to stop screenshare'],
  [CommunicationUiErrorCode.RENDER_REMOTE_VIDEO_ERROR, 'Failed to render remove video'],
  [CommunicationUiErrorCode.RENDER_LOCAL_VIDEO_ERROR, 'Failed to render local video'],
  [CommunicationUiErrorCode.CREATE_CALL_AGENT_ERROR, 'Failed to start call'],
  [CommunicationUiErrorCode.DISPOSE_CALL_AGENT_ERROR, 'Failed to stop call'],
  [CommunicationUiErrorCode.LEAVE_CALL_ERROR, 'Failed to leave call']
]);

export const MapToErrorBarProps = (): ErrorBarProps => {
  const lastError = useLastError();
  let severity: CommunicationUiErrorSeverity | undefined = undefined;
  let message: string | undefined = undefined;
  if (lastError) {
    message = errorCodeToMessage.get(lastError.code);
    if (!message) {
      message = errorCodeToMessage.get(CommunicationUiErrorCode.UNKNOWN_ERROR);
    }
    severity = lastError.severity;
  }
  const setLastError = useSetLastError();
  return {
    message: message,
    severity: severity,
    onClose: () => {
      setLastError(undefined);
    }
  };
};

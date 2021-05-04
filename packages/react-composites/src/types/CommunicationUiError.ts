// © Microsoft Corporation. All rights reserved.

import { ErrorInfo } from 'react';

export enum CommunicationUiErrorCode {
  UNKNOWN_ERROR, // Any error we don't know about that may happen unexpectedly.
  CONFIGURATION_ERROR, // Errors related to configuration issue such as invalid connectionString.
  UNAUTHORIZED_ERROR, // 401 status code returned from ACS resource.
  FORBIDDEN_ERROR, // 403 status code returned from from ACS resource.
  TOO_MANY_REQUESTS_ERROR, // 429 status code returned from ACS resource.
  SERVICE_UNAVAILABLE_ERROR, // 503 status code returned from ACS resource.
  INTERNAL_SERVER_ERROR, // 500 status code returned from ACS resource.
  UNKNOWN_STATUS_CODE_ERROR, // Unknown status code from ACS resource.
  MESSAGE_EXCEEDED_RETRY_ERROR, // Message failed to send even after X number of retries.
  START_REALTIME_NOTIFICATIONS_ERROR, // ChatClient.startRealtimeNotifications() threw an error.
  CREATE_CHAT_THREAD_CLIENT_ERROR, // ChatClient.getChatThreadClient() threw an error.
  SEND_READ_RECEIPT_ERROR, // ChatThreadClient.sendReadReceipt() threw an error.
  GET_READ_RECEIPT_ERROR, // ChatThreadClient.listReadReceipts() threw an error.
  SEND_MESSAGE_ERROR, // ChatThreadClient.sendMessage() threw an error.
  GET_MESSAGE_ERROR, // ChatThreadClient.getMessage() threw an error.
  SEND_TYPING_NOTIFICATION_ERROR, // ChatThreadClient.sendTypingNotification() threw an error.
  GET_MESSAGES_ERROR, // ChatThreadClient.listMessages() threw an error.
  REMOVE_THREAD_MEMBER_ERROR, // ChatThreadClient.removeThreadMember() threw an error.
  UPDATE_THREAD_ERROR, // ChatThreadClient.updateThread() threw an error.
  GET_THREAD_ERROR, // ChatThreadClient.getChatThread() threw an error.
  QUERY_PERMISSIONS_ERROR, // DeviceManager.getPermissionState() threw an error.
  ASK_PERMISSIONS_ERROR, // DeviceManager.askDevicePermission() threw an error.
  SWITCH_VIDEO_SOURCE_ERROR, // LocalVideoStream.switchSource() threw an error.
  UNMUTE_ERROR, // Call.unmute() threw an error or microphone permission not granted.
  MUTE_ERROR, // Call.mute() threw an error.
  START_VIDEO_ERROR, // Error starting local video.
  STOP_VIDEO_ERROR, // Error stopping local video.
  START_SCREEN_SHARE_ERROR, // Call.startScreenSharing() threw an error.
  STOP_SCREEN_SHARE_ERROR, // Call.stopScreenSharing() threw an error.
  RENDER_REMOTE_VIDEO_ERROR, // Renderer.createView() threw an error.
  RENDER_LOCAL_VIDEO_ERROR, // Renderer.createView() threw an error.
  CREATE_CALL_AGENT_ERROR, // CallClient.createCallAgent() threw an error.
  DISPOSE_CALL_AGENT_ERROR, // CallAgent.dispose() threw an error.
  JOIN_CALL_ERROR, // CallAgent.join() threw an error.
  LEAVE_CALL_ERROR // CallAgent.hangup() threw an error or no call exists.
}

/**
 * Severity is a rating provided by UI on the impact of the error. It can be used as a rough metric for decision making.
 * If using ErrorBar component, a INFO, WARNING, or ERROR severity will cause the message to be displayed in ErrorBar.
 */
export enum CommunicationUiErrorSeverity {
  INFO = 'Info',
  WARNING = 'Warning',
  ERROR = 'Error',
  IGNORE = 'Ignore'
}

export interface CommunicationUiErrorInfo {
  message: string;
  code: CommunicationUiErrorCode;
  severity: CommunicationUiErrorSeverity;
  originalError: Error | undefined;
  errorInfo: ErrorInfo | undefined;
}

export interface CommunicationUiErrorArgs {
  message?: string;
  code?: CommunicationUiErrorCode;
  severity?: CommunicationUiErrorSeverity;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * CommunicationUiError is a type defined and used within CommunicationUi and in externally provided onErrorCallback.
 *
 * Message - can be any message and is used to provide some context on the error.
 * Code - is a CommunicationUiErrorCode type and allows the error to be handled programmatically.
 * OriginalError - optional and if present, is the error that was thrown and then wrapped by CommunicationUiError.
 * ErrorInfo - optional and will be provided if the error was caught at the React Error Boundary but it may not always
 *             be present.
 */
export class CommunicationUiError extends Error implements CommunicationUiErrorInfo {
  private _code: CommunicationUiErrorCode;
  private _severity: CommunicationUiErrorSeverity;
  private _originalError: Error | undefined;
  private _errorInfo: ErrorInfo | undefined;

  constructor(args: CommunicationUiErrorArgs) {
    super(args.message ?? 'Unknown error');
    this.message = args.message ?? 'Unknown error';
    this._code = args.code ?? CommunicationUiErrorCode.UNKNOWN_ERROR;
    this._severity = args.severity ?? CommunicationUiErrorSeverity.ERROR;
    this._originalError = args.error;
    this._errorInfo = args.errorInfo;
  }

  public get code(): CommunicationUiErrorCode {
    return this._code;
  }

  public get severity(): CommunicationUiErrorSeverity {
    return this._severity;
  }

  public set severity(severity: CommunicationUiErrorSeverity) {
    this._severity = severity;
  }

  public get originalError(): Error | undefined {
    return this._originalError;
  }

  public get errorInfo(): ErrorInfo | undefined {
    return this._errorInfo;
  }

  public set errorInfo(errorInfo: ErrorInfo | undefined) {
    this._errorInfo = errorInfo;
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const CommunicationUiErrorFromError = (error: any): CommunicationUiError =>
  error instanceof CommunicationUiError ? error : new CommunicationUiError({ error });

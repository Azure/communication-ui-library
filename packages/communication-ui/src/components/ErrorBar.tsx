// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { CommunicationUiErrorSeverity } from '../types/CommunicationUiError';

/**
 * Properties of ErrorBar component
 */
export type ErrorBarProps = {
  /** Message to show in ErrorBar */
  message?: string;
  /** Severity of error to determine type and color of ErrorBar. Defaults to 'Error' type and color red. */
  severity?: CommunicationUiErrorSeverity;
  /** Oprional callback called when ErrorBar is closed */
  onClose?: () => void;
};

const errorBarSeverityToMessageBarType = new Map<CommunicationUiErrorSeverity, MessageBarType>([
  [CommunicationUiErrorSeverity.INFO, MessageBarType.info],
  [CommunicationUiErrorSeverity.WARNING, MessageBarType.warning],
  [CommunicationUiErrorSeverity.ERROR, MessageBarType.error]
]);

/**
 * Displays a message on screen based on message and severity. If message is undefined or if severity is IGNORE,
 * then nothing will be displayed.
 */
export const ErrorBar = (props: ErrorBarProps): JSX.Element | null => {
  const { message, severity, onClose } = props;
  const type = severity
    ? errorBarSeverityToMessageBarType.has(severity)
      ? errorBarSeverityToMessageBarType.get(severity)
      : MessageBarType.error
    : MessageBarType.error;
  const label = severity ? severity.toString() : CommunicationUiErrorSeverity.ERROR.toString();
  if (!message || severity === CommunicationUiErrorSeverity.IGNORE) {
    return null;
  } else {
    return (
      <MessageBar messageBarType={type} isMultiline={false} onDismiss={onClose} dismissButtonAriaLabel="Close">
        {label + ': ' + message}
      </MessageBar>
    );
  }
};

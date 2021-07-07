// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mergeStyles, MessageBar, MessageBarType } from '@fluentui/react';
import { CommunicationUiErrorSeverity } from '../../types';
import { BaseCustomStylesProps } from '@internal/react-components';

/**
 * Props for ErrorBar component
 */
export type ErrorBarProps = {
  /** Message to show in ErrorBar. */
  message?: string;
  /** Severity of error to determine type and color of ErrorBar. Defaults to 'error' type and color red. */
  severity?: CommunicationUiErrorSeverity;
  /** Optional callback called when ErrorBar is closed. */
  onClose?: () => void;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <ErrorBar styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
};

const errorBarSeverityToMessageBarType = new Map<CommunicationUiErrorSeverity, MessageBarType>([
  ['info', MessageBarType.info],
  ['warning', MessageBarType.warning],
  ['error', MessageBarType.error]
]);

/**
 * `ErrorBar` displays a message on screen based on message and severity. If message is undefined or if
 * severity is IGNORE, then nothing will be displayed.
 */
export const ErrorBar = (props: ErrorBarProps): JSX.Element | null => {
  const { message, severity, onClose, styles } = props;
  const type =
    severity && errorBarSeverityToMessageBarType.has(severity)
      ? errorBarSeverityToMessageBarType.get(severity)
      : MessageBarType.error;
  const label: CommunicationUiErrorSeverity = severity ? severity : 'error';
  if (!message || severity === 'ignore') {
    return null;
  } else {
    return (
      <MessageBar
        className={mergeStyles(styles?.root)}
        messageBarType={type}
        isMultiline={false}
        onDismiss={onClose}
        dismissButtonAriaLabel="Close"
      >
        {label + ': ' + message}
      </MessageBar>
    );
  }
};

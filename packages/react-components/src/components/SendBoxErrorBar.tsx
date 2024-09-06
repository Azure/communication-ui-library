// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageBar } from '@fluentui/react';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { MessageBarType } from '@fluentui/react';
import React, { useEffect } from 'react';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { useMemo } from 'react';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { useLocale } from '../localization';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @beta
 * Error bar type for {@link SendBoxErrorBarError}
 */
export enum SendBoxErrorBarType {
  /** Info styled MessageBar */
  info = 0,
  /** Error styled MessageBar */
  error = 1,
  /** Blocked styled MessageBar */
  blocked = 2,
  /** SevereWarning styled MessageBar */
  severeWarning = 3,
  /** Success styled MessageBar */
  success = 4,
  /** Warning styled MessageBar */
  warning = 5
}

/**
 * @beta
 * Error to be displayed to the user in an error bar above sendbox.
 */
export interface SendBoxErrorBarError {
  /** Error Message to be displayed */
  message: string;
  /**
   * Unix Timestamp. Preferred generation using `Date.now()`
   */
  timestamp: number;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * ErrorBar type. Defaults to `warning`.
   */
  errorBarType?: SendBoxErrorBarType;
}

/**
 * @private
 */
export interface SendBoxErrorBarProps {
  /** Error to render */
  error?: SendBoxErrorBarError;
  /**
   * Automatically dismisses the error bar after the specified delay in ms.
   * Example: `10 * 1000` would be 10 seconds
   */
  dismissAfterMs?: number;
  /**
   * Callback to invoke when the error bar is dismissed
   */
  onDismiss?: () => void;
}

/**
 * @private
 */
export const SendBoxErrorBar = (props: SendBoxErrorBarProps): JSX.Element => {
  const { error, dismissAfterMs, onDismiss } = props;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const strings = useLocale().strings.errorBar;

  const [errorMessage, setErrorMessage] = React.useState(error?.message);
  // Using `any` because `NodeJS.Timeout` here will cause `declaration error` with jest.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = React.useRef<any>();

  React.useEffect(() => {
    setErrorMessage(error?.message);
  }, [error]);

  useEffect(() => {
    if (error && dismissAfterMs !== undefined) {
      timeoutRef.current = setTimeout(() => {
        setErrorMessage(undefined);
        onDismiss && onDismiss();
      }, dismissAfterMs);
    }
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [dismissAfterMs, onDismiss, error]);

  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const messageBarType = useMemo(() => {
    switch (error?.errorBarType) {
      case SendBoxErrorBarType.info:
        return MessageBarType.info;
      case SendBoxErrorBarType.error:
        return MessageBarType.error;
      case SendBoxErrorBarType.blocked:
        return MessageBarType.blocked;
      case SendBoxErrorBarType.severeWarning:
        return MessageBarType.severeWarning;
      case SendBoxErrorBarType.success:
        return MessageBarType.success;
      case SendBoxErrorBarType.warning:
      default:
        return MessageBarType.warning;
    }
  }, [error]);

  if (errorMessage) {
    return (
      <MessageBar
        role="alert"
        aria-label={errorMessage}
        data-testid={'send-box-message-bar'}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        messageBarType={messageBarType}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        isMultiline={true}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        key={error?.errorBarType || SendBoxErrorBarType.warning}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        onDismiss={onDismiss}
        /* @conditional-compile-remove(rich-text-editor-image-upload) */
        dismissButtonAriaLabel={strings.dismissButtonAriaLabel}
      >
        {errorMessage}
      </MessageBar>
    );
  } else {
    return <></>;
  }
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageBar, MessageBarType, IMessageBarProps } from '@fluentui/react';
import { useLocale } from '../localization';

/**
 * {@Link ErrorBar} properties.
 *
 * In addition to the following, {@Link ErrorBar} forwards all
 * {@Link @fluentui/react/IMessageBarProps} to the underlying {@Link @fluentui/react/MessageBar}.
 */
export interface ErrorBarProps extends IMessageBarProps {
  /**
   * Strings shown on the UI on errors.
   */
  strings?: ErrorBarStrings;

  /**
   * Currently active error. Must be defined.
   *
   * When the error is cleared, the {@Link ErrorBar} must be removed instead of clearing {@Link ErrorBarProps.activeError}.
   */
  activeError: ErrorType;
}

/**
 * All strings that may be shown on the UI in the {@Link ErrorBar}.
 */
export interface ErrorBarStrings {
  /**
   * A generic message when sending message fails.
   * Prefer more specific error strings when possible.
   */
  sendMessageGeneric: string;
}

/**
 * All errors that can be shown in the {@Link ErrorBar}.
 */
export type ErrorType = keyof ErrorBarStrings;

/**
 * A component to show error messages on the UI.
 * All strings that can be shown are accepted as the {@Link ErrorBarProps.strings} so that they can be localized.
 * Active error is selected by {@Link ErrorBarProps.activeError}.
 *
 * Uses {@Link @fluentui/react/MessageBar} UI element.
 */
export const ErrorBar = (props: ErrorBarProps): JSX.Element => {
  const strings = props.strings ?? useLocale().strings.errorBar;
  return (
    <MessageBar {...props} messageBarType={MessageBarType.error}>
      {strings[props.activeError]}
    </MessageBar>
  );
};

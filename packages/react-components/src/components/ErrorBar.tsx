// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageBar, MessageBarType, IMessageBarProps } from '@fluentui/react';
import { useLocale } from '../localization';

export interface ErrorBarProps extends IMessageBarProps {
  strings?: ErrorBarStrings;
  activeErrors: ErrorType[];
}

export interface ErrorBarStrings {
  sendMessageFailed: string;
}

export type ErrorType = keyof ErrorBarStrings;

export const ErrorBar = (props: ErrorBarProps): JSX.Element => {
  if (props.activeErrors.length === 0) {
    return <></>;
  }

  const strings = props.strings ?? useLocale().strings.errorBar;
  const errors = props.activeErrors.map((k) => strings[k]);
  return <MessageBar messageBarType={MessageBarType.error}>{errors[0]}</MessageBar>;
};

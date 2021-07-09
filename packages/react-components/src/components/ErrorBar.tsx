// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { MessageBar, MessageBarType, IMessageBarProps } from '@fluentui/react';
import { useLocale } from '../localization';

export interface ErrorBarProps extends IMessageBarProps {
  strings?: ErrorBarStrings;
  activeError: ErrorType;
  onClearActiveError: () => void;
}

export interface ErrorBarStrings {
  sendMessageGeneric: string;
}

export type ErrorType = keyof ErrorBarStrings;

export const ErrorBar = (props: ErrorBarProps): JSX.Element => {
  const strings = props.strings ?? useLocale().strings.errorBar;
  return <MessageBar messageBarType={MessageBarType.error}>{strings[props.activeError]}</MessageBar>;
};

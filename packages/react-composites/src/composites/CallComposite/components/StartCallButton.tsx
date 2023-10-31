// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PrimaryButton, mergeStyles, IButtonProps } from '@fluentui/react';
import React from 'react';
import { buttonStyle, buttonWithIconStyles } from '../styles/StartCallButton.styles';
import { useLocale } from '../../localization';

/**
 * @private
 */
export interface StartCallButtonProps extends IButtonProps {
  className?: string;
  /** If set, the button is intended to rejoin an existing call. */
  rejoinCall?: boolean;
}

/**
 * @private
 */
export const StartCallButton = (props: StartCallButtonProps): JSX.Element => {
  const { rejoinCall } = props;
  const locale = useLocale();

  return (
    <PrimaryButton
      {...props}
      data-ui-id="call-composite-start-call-button"
      className={mergeStyles(buttonStyle, props.className)}
      styles={buttonWithIconStyles}
      text={rejoinCall ? locale.strings.call.rejoinCallButtonLabel : locale.strings.call.startCallButtonLabel}
    />
  );
};

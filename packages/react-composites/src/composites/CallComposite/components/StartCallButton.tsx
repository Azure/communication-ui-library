// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton, mergeStyles } from '@fluentui/react';
import React from 'react';
import { buttonStyle, buttonWithIconStyles, videoCameraIconStyle } from '../styles/StartCallButton.styles';
import { Video20Filled } from '@fluentui/react-icons';
import { useLocale } from '../../localization';

/**
 * @private
 */
export interface StartCallButtonProps {
  onClickHandler: () => void;
  isDisabled: boolean;
  className?: string;
  /** If set, the button is intended to rejoin an existing call. */
  rejoinCall?: boolean;
}

/**
 * @private
 */
export const StartCallButton = (props: StartCallButtonProps): JSX.Element => {
  const { isDisabled, onClickHandler, rejoinCall } = props;
  const locale = useLocale();

  return (
    <PrimaryButton
      data-ui-id="call-composite-start-call-button"
      disabled={isDisabled}
      className={mergeStyles(buttonStyle, props.className)}
      styles={buttonWithIconStyles}
      text={rejoinCall ? locale.strings.call.rejoinCallButtonLabel : locale.strings.call.startCallButtonLabel}
      onClick={onClickHandler}
      onRenderIcon={() => <Video20Filled className={videoCameraIconStyle} />}
    />
  );
};

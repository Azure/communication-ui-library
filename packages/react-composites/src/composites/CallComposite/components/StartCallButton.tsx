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
}

/**
 * @private
 */
export const StartCallButton = (props: StartCallButtonProps): JSX.Element => {
  const { isDisabled, onClickHandler } = props;
  const locale = useLocale();

  return (
    <PrimaryButton
      data-ui-id="call-composite-start-call-button"
      disabled={isDisabled}
      className={mergeStyles(buttonStyle, props.className)}
      styles={buttonWithIconStyles}
      text={locale.strings.call.startCallButtonText}
      onClick={onClickHandler}
      onRenderIcon={() => <Video20Filled className={videoCameraIconStyle} />}
    />
  );
};

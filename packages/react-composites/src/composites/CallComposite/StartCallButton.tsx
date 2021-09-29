// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton } from '@fluentui/react';
import React from 'react';
import { buttonStyle, videoCameraIconStyle } from './styles/StartCallButton.styles';
import { Video20Filled } from '@fluentui/react-icons';
import { useLocale } from '../localization';

/**
 * @private
 */
export interface StartCallButtonProps {
  onClickHandler: () => void;
  isDisabled: boolean;
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
      className={buttonStyle}
      onClick={onClickHandler}
    >
      <Video20Filled primaryFill="currentColor" className={videoCameraIconStyle} />
      {locale.strings.call.startCallButtonText}
    </PrimaryButton>
  );
};

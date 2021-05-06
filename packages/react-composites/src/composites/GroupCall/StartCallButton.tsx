//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton } from '@fluentui/react';
import React from 'react';
import { buttonStyle, videoCameraIconStyle } from './styles/StartCallButton.styles';
import { VideoCameraEmphasisIcon } from '@fluentui/react-icons-northstar';

export interface StartCallButtonProps {
  onClickHandler: () => void;
  isDisabled: boolean;
}

const buttonText = 'Start call';

export const StartCallButton = (props: StartCallButtonProps): JSX.Element => {
  const { isDisabled, onClickHandler } = props;

  return (
    <PrimaryButton disabled={isDisabled} className={buttonStyle} onClick={onClickHandler}>
      <VideoCameraEmphasisIcon className={videoCameraIconStyle} size="medium" />
      {buttonText}
    </PrimaryButton>
  );
};

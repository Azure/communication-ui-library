// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PrimaryButton } from '@fluentui/react';
import React from 'react';
import { buttonStyle, videoCameraIconStyle } from './styles/StartCallButton.styles';
import { Video20Filled } from '@fluentui/react-icons';

export interface StartCallButtonProps {
  onClickHandler: () => void;
  isDisabled: boolean;
  buttonText?: string;
}

const buttonText = 'Start Call';

export const StartCallButton = (props: StartCallButtonProps): JSX.Element => {
  const { isDisabled, onClickHandler } = props;

  return (
    <PrimaryButton disabled={isDisabled} className={buttonStyle} onClick={onClickHandler}>
      <Video20Filled className={videoCameraIconStyle} primaryFill="currentColor" />
      {props.buttonText ?? buttonText}
    </PrimaryButton>
  );
};

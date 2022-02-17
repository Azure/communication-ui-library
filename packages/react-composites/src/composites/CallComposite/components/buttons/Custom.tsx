// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButton } from '@internal/react-components';
import React from 'react';
import {
  CallControlDisplayType,
  CustomCallControlButtonCallback,
  CustomCallControlButtonPlacement
} from '../../types/CallControlOptions';

/** @private */
export type CustomButtons = { [key in CustomCallControlButtonPlacement]: JSX.Element | undefined };

/** @private */
export const generateCustomButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomButtons => {
  const response = {
    first: undefined,
    afterCameraButton: undefined,
    afterEndCallButton: undefined,
    afterMicrophoneButton: undefined,
    afterDevicesButton: undefined,
    afterParticipantsButton: undefined,
    afterScreenShareButton: undefined,
    last: undefined
  };
  if (!onFetchCustomButtonProps) {
    return response;
  }

  const allButtonProps = onFetchCustomButtonProps.map((f) => f({ displayType }));
  for (const key in response) {
    response[key] = (
      <>
        {allButtonProps
          .filter((buttonProps) => buttonProps.placement === key)
          .map((buttonProps, i) => (
            <ControlBarButton {...buttonProps} key={`${buttonProps.placement}_${i}`} />
          ))}
      </>
    );
  }
  return response;
};

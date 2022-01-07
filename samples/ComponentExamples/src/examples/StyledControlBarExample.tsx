// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CameraButton, ControlBar, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const StyledControlBarExample = (): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  return (
    <>
      <h3>An example of custom sytled Call ControlBar:</h3>
      <br />
      <ControlBar layout={'horizontal'}>
        <CameraButton {...cameraButtonProps} />
      </ControlBar>
    </>
  );
};

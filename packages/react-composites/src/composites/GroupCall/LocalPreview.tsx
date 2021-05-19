// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallVideoOffIcon } from '@fluentui/react-icons-northstar';
import { Stack, Text } from '@fluentui/react';
import React from 'react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import { connectFuncsToContext, MapToErrorBarProps } from '../../consumers';
import {
  StreamMedia,
  VideoTile,
  ErrorBar as ErrorBarComponent,
  MicrophoneButton,
  ControlBar,
  CameraButton
} from 'react-components';
import { usePropsFor } from './hooks/usePropsFor';
import { localPreviewSelector } from '@azure/acs-calling-selector';
import { useAdaptedSelector } from './hooks/useAdaptedSelector';

const onRenderPlaceholder = (): JSX.Element => {
  return (
    <Stack style={{ width: '100%', height: '100%' }} verticalAlign="center">
      <Stack.Item align="center">
        <CallVideoOffIcon />
      </Stack.Item>
      <Stack.Item align="center">
        <Text className={cameraOffLabelStyle}>Your camera is turned off</Text>
      </Stack.Item>
    </Stack>
  );
};

export const LocalPreview = (): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const microphoneButtonProps = usePropsFor(MicrophoneButton);
  const localPreviewProps = useAdaptedSelector(localPreviewSelector);

  const ErrorBar = connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        userId={'LocalpreviewUser'}
        styles={localPreviewTileStyle}
        isVideoReady={!!localPreviewProps.videoStreamElement}
        renderElement={<StreamMedia videoStreamElement={localPreviewProps.videoStreamElement} />}
        onRenderPlaceholder={onRenderPlaceholder}
      >
        <ControlBar layout="floatingBottom">
          <CameraButton {...cameraButtonProps} />
          <MicrophoneButton {...microphoneButtonProps} />
        </ControlBar>
      </VideoTile>
      <ErrorBar />
    </Stack>
  );
};

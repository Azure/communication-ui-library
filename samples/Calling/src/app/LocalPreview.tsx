// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CallVideoOffIcon } from '@fluentui/react-icons-northstar';
import { Stack, Text } from '@fluentui/react';
import { localPreviewContainerStyle, cameraOffLabelStyle, localPreviewTileStyle } from './styles/LocalPreview.styles';
import { CameraButton, ControlBar, MicrophoneButton, StreamMedia, VideoTile } from 'react-components';
import { useCallingSelector as useSelector, useCallingPropsFor as usePropsFor } from '@azure/acs-calling-selector';
import { localPreviewSelector } from './selectors/localPreviewSelector';

const onRenderPlaceholder = (): JSX.Element => {
  return (
    <Stack style={{ width: '100%', height: '100%' }} verticalAlign="center">
      <Stack.Item align="center">
        <CallVideoOffIcon />
      </Stack.Item>
      <Stack.Item align="center">
        <Text className={cameraOffLabelStyle}>Your camera is turned off.</Text>
      </Stack.Item>
    </Stack>
  );
};

export interface LocalPreviewProps {
  isMicrophoneOn: boolean;
  setIsMicrophoneOn: (isEnabled: boolean) => void;
}

export const LocalPreview = (props: LocalPreviewProps): JSX.Element => {
  const cameraButtonProps = usePropsFor(CameraButton);
  const localPreviewProps = useSelector(localPreviewSelector);

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        styles={localPreviewTileStyle}
        isVideoReady={!!localPreviewProps.videoStreamElement}
        renderElement={<StreamMedia videoStreamElement={localPreviewProps.videoStreamElement} />}
        onRenderPlaceholder={onRenderPlaceholder}
        isMirrored={true}
      >
        <ControlBar layout="floatingBottom">
          <CameraButton {...cameraButtonProps} />
          <MicrophoneButton
            checked={props.isMicrophoneOn}
            onToggleMicrophone={async () => {
              props.setIsMicrophoneOn(!props.isMicrophoneOn);
            }}
          />
        </ControlBar>
      </VideoTile>
    </Stack>
  );
};

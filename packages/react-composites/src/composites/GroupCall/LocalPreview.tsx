//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallVideoIcon, MicIcon } from '@fluentui/react-icons-northstar';
import { Stack, Toggle, Image, ImageFit, IImageStyles } from '@fluentui/react';
import React from 'react';
import {
  localPreviewContainerStyle,
  toggleButtonsBarStyle,
  toggleButtonsBarToken,
  toggleStyle
} from './styles/LocalPreview.styles';
import { MapToMediaControlsProps, MediaControlsContainerProps } from './consumers/MapToMediaControlsProps';
import {
  connectFuncsToContext,
  MapToLocalDeviceSettingsProps,
  LocalDeviceSettingsContainerProps,
  MapToErrorBarProps,
  MapToLocalVideoProps
} from '../../consumers';
import { StreamMedia, VideoTile, ErrorBar as ErrorBarComponent } from 'react-components';
import staticMediaSVG from './assets/staticmedia.svg';
import { useCallContext } from '../../providers';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { WithErrorHandling } from '../../utils/WithErrorHandling';
import { CommunicationUiErrorFromError } from '../../types/CommunicationUiError';

const staticAvatarStyle: Partial<IImageStyles> = {
  image: { maxWidth: '10rem', maxHeight: '10rem', width: '100%', height: '100%' },
  root: { flexGrow: 1 }
};

const imageProps = {
  src: staticMediaSVG.toString(),
  imageFit: ImageFit.contain,
  maximizeFrame: true
};

const LocalPreviewComponentBase = (
  props: MediaControlsContainerProps & LocalDeviceSettingsContainerProps & ErrorHandlingProps
): JSX.Element => {
  const isAudioDisabled = !props.audioDeviceInfo || props.audioDeviceList.length === 0;
  const isVideoDisabled = !props.videoDeviceInfo || props.videoDeviceList.length === 0 || props.localVideoBusy;
  // get the stream in here instead of the mapper for now
  // we haven't properly properly exported this component to make it re-usable
  // we should create a MapToLocalPreviewProps, instead of using MapToMediaControlsProps and MapToLocalDeviceSettingsProps
  const { localVideoStream } = useCallContext();

  const { isVideoReady, videoStreamElement } = MapToLocalVideoProps({
    stream: localVideoStream,
    scalingMode: 'Crop'
  });
  const ErrorBar = connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        isVideoReady={isVideoReady}
        videoProvider={<StreamMedia videoStreamElement={videoStreamElement} />}
        placeholderProvider={
          <Image styles={staticAvatarStyle} aria-label="Local video preview image" {...imageProps} />
        }
      />
      <Stack
        horizontal
        horizontalAlign="center"
        verticalAlign="center"
        tokens={toggleButtonsBarToken}
        className={toggleButtonsBarStyle}
      >
        <CallVideoIcon size="medium" />
        <Toggle
          styles={toggleStyle}
          disabled={isVideoDisabled}
          onChange={() => {
            props.toggleLocalVideo().catch((error) => {
              if (props.onErrorCallback) {
                props.onErrorCallback(CommunicationUiErrorFromError(error));
              } else {
                throw error;
              }
            });
          }}
          ariaLabel="Video Icon"
        />
        <MicIcon size="medium" />
        <Toggle
          styles={toggleStyle}
          disabled={isAudioDisabled}
          onChange={() => {
            props.toggleMicrophone().catch((error) => {
              if (props.onErrorCallback) {
                props.onErrorCallback(CommunicationUiErrorFromError(error));
              } else {
                throw error;
              }
            });
          }}
          ariaLabel="Microphone Icon"
        />
      </Stack>
      <ErrorBar />
    </Stack>
  );
};

export const LocalPreviewComponent = (
  props: MediaControlsContainerProps & LocalDeviceSettingsContainerProps & ErrorHandlingProps
): JSX.Element => WithErrorHandling(LocalPreviewComponentBase, props);

export const LocalPreview = connectFuncsToContext(
  LocalPreviewComponent,
  MapToLocalDeviceSettingsProps,
  MapToMediaControlsProps
);

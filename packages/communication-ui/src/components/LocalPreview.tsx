// © Microsoft Corporation. All rights reserved.

import { CallVideoIcon, MicIcon } from '@fluentui/react-icons-northstar';
import { Stack, Toggle, Image, ImageFit, IImageStyles } from '@fluentui/react';
import React from 'react';
import {
  localPreviewContainerStyle,
  toggleButtonsBarStyle,
  toggleButtonsBarToken,
  toggleStyle
} from './styles/LocalPreview.styles';
import { MapToMediaControlsProps, MediaControlsContainerProps } from '../consumers/MapToMediaControlsProps';
import {
  MapToLocalDeviceSettingsProps,
  LocalDeviceSettingsContainerProps
} from '../consumers/MapToLocalDeviceSettingsProps';
import { connectFuncsToContext } from '../consumers';
import { MediaGalleryTileComponent } from './MediaGalleryTile';
import { MapToLocalVideoProps } from '../consumers/MapToVideoProps';
import staticMediaSVG from '../assets/staticmedia.svg';

const staticAvatarStyle: Partial<IImageStyles> = {
  image: { maxWidth: '10rem', maxHeight: '10rem', width: '100%', height: '100%' },
  root: { flexGrow: 1 }
};

const imageProps = {
  src: staticMediaSVG.toString(),
  imageFit: ImageFit.contain,
  maximizeFrame: true
};

const LocalPreviewComponent = (props: MediaControlsContainerProps & LocalDeviceSettingsContainerProps): JSX.Element => {
  const isAudioDisabled = !props.audioDeviceInfo || props.audioDeviceList.length === 0;
  const isVideoDisabled = !props.videoDeviceInfo || props.videoDeviceList.length === 0 || props.localVideoBusy;
  return (
    <Stack className={localPreviewContainerStyle}>
      {connectFuncsToContext(
        MediaGalleryTileComponent,
        MapToLocalVideoProps
      )({
        fallbackElement: <Image styles={staticAvatarStyle} aria-label="Local video preview image" {...imageProps} />
      })}
      <Stack
        horizontal
        horizontalAlign="center"
        verticalAlign="center"
        tokens={toggleButtonsBarToken}
        className={toggleButtonsBarStyle}
      >
        <CallVideoIcon size="medium" />
        <Toggle
          onKeyDownCapture={
            (/*e*/) => {
              // if (e.keyCode === 13 && props.localVideoRendererIsBusy) {
              //     e.preventDefault();
              // }
            }
          }
          styles={toggleStyle}
          disabled={isVideoDisabled}
          onChange={props.toggleLocalVideo}
          ariaLabel="Video Icon"
        />
        <MicIcon size="medium" />
        <Toggle
          styles={toggleStyle}
          disabled={isAudioDisabled}
          onChange={props.toggleMicrophone}
          ariaLabel="Microphone Icon"
        />
      </Stack>
    </Stack>
  );
};

export default connectFuncsToContext(LocalPreviewComponent, MapToLocalDeviceSettingsProps, MapToMediaControlsProps);

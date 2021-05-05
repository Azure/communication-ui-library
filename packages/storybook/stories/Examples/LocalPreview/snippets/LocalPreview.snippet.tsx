import { StreamMedia, VideoTile } from '@azure/communication-ui';
import { useTheme } from '@fluentui/react-theme-provider';
import React from 'react';
import tileContentNotReady from '../../../../public/images/noLocalVideo.svg';
import { Stack, mergeStyles, Toggle, ImageFit, Image, IStackTokens, IToggleStyles } from '@fluentui/react';
import { CallVideoIcon, MicIcon } from '@fluentui/react-northstar';
import { renderVideoStream } from '../../../utils';

export interface LocalPreviewProps {
  isVideoReady: boolean;
  isCameraEnabled: boolean;
  isMicrophoneEnabled: boolean;
}

export const LocalPreviewExample = (props: LocalPreviewProps): JSX.Element => {
  const theme = useTheme();
  const palette = theme.palette;

  const localPreviewContainerStyle = mergeStyles({
    maxWidth: '25rem',
    minWidth: '12.5rem',
    width: '100%',
    height: '100%',
    maxHeight: '18.75rem',
    minHeight: '16.875rem',
    background: palette.neutralLighter,
    color: palette.neutralPrimaryAlt
  });

  const tileContentProps = {
    imageFit: ImageFit.contain,
    maximizeFrame: true
  };

  const toggleButtonsBarStyle = mergeStyles({
    height: '2.8125rem',
    width: '100%'
  });

  const toggleButtonsBarToken: IStackTokens = {
    childrenGap: '0.625rem',
    padding: '0.625rem'
  };

  const toggleStyle: Partial<IToggleStyles> = {
    root: { marginBottom: 0 }
  };

  const videoTileStyle = {
    root: {
      minHeight: '14rem'
    }
  };

  const { isVideoReady, isCameraEnabled, isMicrophoneEnabled } = props;

  return (
    <Stack className={localPreviewContainerStyle}>
      <VideoTile
        styles={videoTileStyle}
        isVideoReady={isVideoReady}
        videoProvider={<StreamMedia videoStreamElement={renderVideoStream()} />}
        placeholderProvider={
          <Image
            aria-label="Local video preview when video is not ready"
            {...tileContentProps}
            src={tileContentNotReady}
          />
        }
      />
      <Stack
        horizontal
        horizontalAlign="center"
        verticalAlign="center"
        tokens={toggleButtonsBarToken}
        className={mergeStyles(toggleButtonsBarStyle, { background: theme.palette.neutralLight })}
      >
        <CallVideoIcon size="medium" style={{ color: theme.palette.black }} />
        <Toggle styles={toggleStyle} disabled={!isCameraEnabled} ariaLabel="Video Icon" />
        <MicIcon size="medium" style={{ color: theme.palette.black }} />
        <Toggle styles={toggleStyle} disabled={!isMicrophoneEnabled} ariaLabel="Microphone Icon" />
      </Stack>
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CaptionsBanner, CaptionsSettingsModal, ControlBarButton, useCall } from '@azure/communication-react';
import {
  usePropsFor,
  VideoGallery,
  ControlBar,
  CameraButton,
  MicrophoneButton,
  ScreenShareButton,
  EndCallButton,
  VideoStreamOptions,
  StartCaptionsButton
} from '@azure/communication-react';
import { StartRealTimeTextButton, RealTimeTextModal } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { LocalLanguage20Regular } from '@fluentui/react-icons';
import React, { useCallback, useState } from 'react';

/**
 * CallingComponents component that renders the video gallery and control bar for a calling experience.
 * @returns JSX.Element - The rendered CallingComponents component.
 */
export const CallingComponents = (): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);
  const startCaptionsButtonProps = usePropsFor(StartCaptionsButton);
  const captionsSettingsModalProps = usePropsFor(CaptionsSettingsModal);
  const captionsBannerProps = usePropsFor(CaptionsBanner);
  const [callEnded, setCallEnded] = useState(false);
  const [showRealTimeTextModal, setShowRealTimeTextModal] = useState(false);
  const [isRealTimeTextStarted, setIsRealTimeTextStarted] = useState(false);
  const [showCaptionsSettingsModal, setShowCaptionsSettingsModal] = useState(false);
  const call = useCall();
  const localVideoViewOptions = {
    scalingMode: 'Crop',
    isMirrored: true
  } as VideoStreamOptions;

  const remoteVideoViewOptions = {
    scalingMode: 'Crop'
  } as VideoStreamOptions;

  const onHangup = useCallback(async (): Promise<void> => {
    await endCallProps.onHangUp();
    setCallEnded(true);
  }, [endCallProps]);

  if (callEnded) {
    return <CallEnded />;
  }

  return (
    <Stack style={{ height: '100%' }}>
      {videoGalleryProps && (
        <Stack verticalAlign="center" style={{ height: '100%' }}>
          <VideoGallery
            {...videoGalleryProps}
            styles={VideoGalleryStyles}
            layout={'floatingLocalVideo'}
            localVideoViewOptions={localVideoViewOptions}
            remoteVideoViewOptions={remoteVideoViewOptions}
          />
          {captionsSettingsModalProps?.isCaptionsFeatureActive && (
            <CaptionsSettingsModal
              {...captionsSettingsModalProps}
              showModal={showCaptionsSettingsModal}
              onDismissCaptionsSettings={() => {
                setShowCaptionsSettingsModal(false);
              }}
            />
          )}
          {showRealTimeTextModal && (
            <RealTimeTextModal
              showModal={showRealTimeTextModal}
              onDismissModal={() => {
                setShowRealTimeTextModal(false);
              }}
              onStartRealTimeText={() => {
                setIsRealTimeTextStarted(true);
              }}
            />
          )}
          {(captionsBannerProps?.isCaptionsOn || captionsBannerProps.isRealTimeTextOn || isRealTimeTextStarted) && (
            <CaptionsBanner
              {...captionsBannerProps}
              isRealTimeTextOn={captionsBannerProps.isRealTimeTextOn || isRealTimeTextStarted}
            />
          )}
          <Stack>
            <ControlBar layout={'floatingBottom'}>
              {cameraProps && <CameraButton {...cameraProps} />}
              {microphoneProps && <MicrophoneButton {...microphoneProps} />}
              {screenShareProps && <ScreenShareButton {...screenShareProps} />}
              {startCaptionsButtonProps && (
                <StartCaptionsButton
                  {...startCaptionsButtonProps}
                  disabled={!(call?.state === 'Connected')}
                  onStartCaptions={async () => {
                    setShowCaptionsSettingsModal(true);
                    startCaptionsButtonProps.onStartCaptions();
                  }}
                />
              )}
              {startCaptionsButtonProps && (
                <ControlBarButton
                  onRenderOnIcon={() => <LocalLanguage20Regular />}
                  onRenderOffIcon={() => <LocalLanguage20Regular />}
                  disabled={!captionsSettingsModalProps.isCaptionsFeatureActive}
                  onClick={() => {
                    setShowCaptionsSettingsModal(true);
                  }}
                />
              )}
              {
                <StartRealTimeTextButton
                  disabled={!(call?.state === 'Connected')}
                  isRealTimeTextOn={captionsBannerProps.isRealTimeTextOn || isRealTimeTextStarted}
                  onStartRealTimeText={() => {
                    setShowRealTimeTextModal(true);
                  }}
                />
              }
              {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
            </ControlBar>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

function CallEnded(): JSX.Element {
  return <h1>You ended the call.</h1>;
}

export default CallingComponents;

const VideoGalleryStyles = {
  root: {
    height: '100%',
    width: '100%',
    minHeight: '10rem', // space affordance to ensure media gallery is never collapsed
    minWidth: '6rem'
  }
};

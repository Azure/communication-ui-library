// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { ErrorBar } from '@internal/react-components';
import { useSelector } from '../hooks/useSelector';
import { lobbySelector } from '../selectors/lobbySelector';
import { CallCompositeOptions } from '../CallComposite';
import { CallArrangement } from '../components/CallArrangement';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { usePropsFor } from '../hooks/usePropsFor';
import { LobbyTile } from '../components/LobbyTile';
import { getCallStatus, getIsPreviewCameraOn } from '../selectors/baseSelectors';
import { useHandlers } from '../hooks/useHandlers';
import { reduceCallControlsForMobile } from '../utils';
import { CallControlOptions } from '../components/CallControls';
import { MediaGallery } from '../components/MediaGallery';

/**
 * @private
 */
export interface LobbyPageStrings {
  connectingToCall: string;
  waitingToBeAdmitted: string;
}

/**
 * @private
 */
export interface LobbyPageProps {
  endCallHandler(): void;
  strings: LobbyPageStrings;
  options?: CallCompositeOptions;
}

/**
 * @private
 */
export const LobbyPage = (props: LobbyPageProps): JSX.Element => {
  const devicePermissions = useSelector(devicePermissionSelector);
  const errorBarProps = usePropsFor(ErrorBar);
  const lobbyProps = useSelector(lobbySelector);
  const lobbyTileHandlers = useHandlers(LobbyTile);

  const callState = useSelector(getCallStatus);
  const inLobby = callState === 'InLobby';
  const callStateText = inLobby ? props.strings.waitingToBeAdmitted : props.strings.connectingToCall;

  // When transitioning to the lobby page we need to trigger onStartLocalVideo() to
  // transition the local preview camera setting into the call. This matches the logic
  // used in the MediaGallery. @TODO: Can we simply have the callHandlers handle this
  // transition logic.
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);
  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);
  const isVideoStreamOn = lobbyProps.localParticipantVideoStream.isAvailable;
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  useEffect(() => {
    if (inLobby) {
      if (isPreviewCameraOn && !isVideoStreamOn && !isButtonStatusSynced) {
        mediaGalleryHandlers.onStartLocalVideo();
      }
      setIsButtonStatusSynced(true);
    }
  }, [inLobby, isButtonStatusSynced, isPreviewCameraOn, isVideoStreamOn, mediaGalleryHandlers, props]);

  // Reduce the controls shown when mobile view is enabled.
  let callControlOptions = props.options?.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  callControlOptions = disableLobbyPageControls(callControlOptions);

  return (
    <CallArrangement
      complianceBannerProps={{}}
      permissionBannerProps={{
        microphonePermissionGranted: devicePermissions.audio,
        cameraPermissionGranted: devicePermissions.video
      }}
      errorBarProps={props.options?.errorBar !== false && { ...errorBarProps }}
      callControlProps={
        callControlOptions !== false && {
          onEndCallClick: props.endCallHandler,
          options: callControlOptions
        }
      }
      onRenderGalleryContent={() => (
        <LobbyTile
          {...lobbyProps}
          {...lobbyTileHandlers}
          overlay={{ text: callStateText, overlayIcon: () => <>☕</> }}
        />
      )}
      dataUiId={'lobby-page'}
    />
  );
};

const disableLobbyPageControls = (
  callControlOptions: CallControlOptions | boolean | undefined
): CallControlOptions | boolean | undefined => {
  let newOptions = callControlOptions;
  if (newOptions !== false) {
    if (newOptions === true || newOptions === undefined) {
      newOptions = {
        participantsButton: { disabled: true },
        screenShareButton: { disabled: true }
      };
    } else {
      if (newOptions.participantsButton !== false) {
        newOptions.participantsButton = { disabled: true };
      }
      if (newOptions.screenShareButton !== false) {
        newOptions.screenShareButton = { disabled: true };
      }
    }
  }

  return newOptions;
};

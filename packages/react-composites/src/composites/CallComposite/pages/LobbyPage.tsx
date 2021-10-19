// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { ErrorBar } from '@internal/react-components';
import { useSelector } from '../hooks/useSelector';
import { lobbySelector } from '../selectors/lobbySelector';
import { CallCompositeOptions } from '../CallComposite';
import { CallArrangement } from '../components/CallArrangement';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { usePropsFor } from '../hooks/usePropsFor';
import { LobbyTile } from '../components/LobbyTile';
import { getCallStatus } from '../selectors/baseSelectors';
import { useHandlers } from '../hooks/useHandlers';
import { CallControlOptions } from '../components/CallControls';
import { reduceCallControlsSetForMobile } from '../utils';

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
  const lobbyHandlers = useHandlers(LobbyTile);

  const callState = useSelector(getCallStatus);
  const callStateText = callState === 'InLobby' ? props.strings.waitingToBeAdmitted : props.strings.connectingToCall;

  // Reduce the controls shown when mobile view is enabled.
  let callControlOptions: false | CallControlOptions =
    props.options?.callControls !== false
      ? props.options?.callControls === true
        ? {}
        : props.options?.callControls || {}
      : false;
  if (callControlOptions && props.options?.mobileView) {
    callControlOptions.compressedMode = true;
    callControlOptions = reduceCallControlsSetForMobile(callControlOptions);
  }

  return (
    <CallArrangement
      complianceBannerProps={{}}
      permissionBannerProps={{
        microphonePermissionGranted: devicePermissions.audio,
        cameraPermissionGranted: devicePermissions.video
      }}
      errorBarProps={props.options?.errorBar !== false && { ...errorBarProps }}
      callControlProps={
        // @TODO: we need to use the local device video stream until the call has been joined.
        // The issue is that when the call state is "connecting" to the call we show the lobby
        // screen but we haven't connected to a call yet. The lobby screen is trying to use the
        // props and handlers for a non-existent call state. So the lobby screen has to pivot between
        // using the localDevicePreview-style props/handlers when it is "connecting" but use the
        // call-style props when "connected".
        callControlOptions !== false && {
          onEndCallClick: props.endCallHandler,
          options: callControlOptions
        }
      }
      onRenderGalleryContent={() => (
        <LobbyTile {...lobbyProps} {...lobbyHandlers} overlay={{ text: callStateText, overlayIcon: () => <>☕</> }} />
      )}
      dataUiId={'lobby-page'}
    />
  );
};

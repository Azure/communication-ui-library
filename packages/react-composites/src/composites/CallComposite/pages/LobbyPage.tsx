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
import { reduceCallControlsForMobile } from '../utils';

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
  const callControlOptions = props.options?.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

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
        <LobbyTile {...lobbyProps} {...lobbyHandlers} overlay={{ text: callStateText, overlayIcon: () => <>☕</> }} />
      )}
      dataUiId={'lobby-page'}
    />
  );
};

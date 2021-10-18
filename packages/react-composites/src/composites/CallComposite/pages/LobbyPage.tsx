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
        props.options?.callControls !== false && {
          onEndCallClick: props.endCallHandler,
          options: props.options?.callControls
        }
      }
      onRenderGalleryContent={() => (
        <LobbyTile {...lobbyProps} {...lobbyHandlers} overlay={{ text: callStateText, overlayIcon: () => <>☕</> }} />
      )}
    />
  );
};

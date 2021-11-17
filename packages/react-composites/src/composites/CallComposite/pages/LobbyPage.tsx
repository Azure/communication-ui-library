// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { ErrorBar } from '@internal/react-components';
import { useSelector } from '../hooks/useSelector';
import { lobbySelector } from '../selectors/lobbySelector';
import { CallCompositeOptions } from '../CallComposite';
import { CallArrangement } from '../components/CallArrangement';
import { usePropsFor } from '../hooks/usePropsFor';
import { LobbyOverlayProps, LobbyTile } from '../components/LobbyTile';
import { getCallStatus } from '../selectors/baseSelectors';
import { reduceCallControlsForMobile } from '../utils';
import { CallControlOptions } from '../components/CallControls';
import { CallCompositeStrings } from '../Strings';
import { useLocale } from '../../localization';
import { Icon } from '@fluentui/react';
import { useLocalVideoStartTrigger } from '../components/MediaGallery';

/**
 * @private
 */
export interface LobbyPageProps {
  mobileView: boolean;
  options?: CallCompositeOptions;
}

/**
 * @private
 */
export const LobbyPage = (props: LobbyPageProps): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
  const lobbyProps = useSelector(lobbySelector);
  const strings = useLocale().strings.call;

  const callState = useSelector(getCallStatus);
  const inLobby = callState === 'InLobby';

  useLocalVideoStartTrigger(lobbyProps.localParticipantVideoStream.isAvailable, inLobby);

  // Reduce the controls shown when mobile view is enabled.
  let callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  callControlOptions = disableLobbyPageControls(callControlOptions);

  return (
    <CallArrangement
      complianceBannerProps={{}}
      errorBarProps={props.options?.errorBar !== false && { ...errorBarProps }}
      callControlProps={
        callControlOptions !== false && {
          options: callControlOptions,
          increaseFlyoutItemSize: props.mobileView
        }
      }
      mobileView={props.mobileView}
      onRenderGalleryContent={() => <LobbyTile {...lobbyProps} overlayProps={overlayProps(strings, inLobby)} />}
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

const overlayProps = (strings: CallCompositeStrings, inLobby: boolean): LobbyOverlayProps =>
  inLobby ? overlayPropsWaitingToBeAdmitted(strings, inLobby) : overlayPropsConnectingToCall(strings, inLobby);

const overlayPropsConnectingToCall = (strings: CallCompositeStrings, inLobby: boolean): LobbyOverlayProps => ({
  title: strings.lobbyScreenConnectingToCallTitle,
  moreDetails: strings.lobbyScreenConnectingToCallMoreDetails,
  overlayIcon: <Icon iconName="LobbyScreenConnectingToCall" />
});

const overlayPropsWaitingToBeAdmitted = (strings: CallCompositeStrings, inLobby: boolean): LobbyOverlayProps => ({
  title: strings.lobbyScreenWaitingToBeAdmittedTitle,
  moreDetails: strings.lobbyScreenWaitingToBeAdmittedMoreDetails,
  overlayIcon: <Icon iconName="LobbyScreenWaitingToBeAdmitted" />
});

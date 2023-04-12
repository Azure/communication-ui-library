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
import { getCallStatus, getRemoteParticipants } from '../selectors/baseSelectors';
import { disableCallControls, reduceCallControlsForMobile } from '../utils';
import { CallCompositeStrings } from '../Strings';
import { useLocale } from '../../localization';
import { useLocalVideoStartTrigger } from '../components/MediaGallery';
import { CallCompositeIcon } from '../../common/icons';
import { isPhoneNumberIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';

/**
 * @private
 */
export interface LobbyPageProps {
  mobileView: boolean;
  /* @conditional-compile-remove(one-to-n-calling) */
  modalLayerHostId: string;
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

  const participants = useSelector(getRemoteParticipants) ?? {};

  useLocalVideoStartTrigger(lobbyProps.localParticipantVideoStream.isAvailable, inLobby);

  // Reduce the controls shown when mobile view is enabled.
  let callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  callControlOptions = disableCallControls(callControlOptions, ['screenShareButton', 'participantsButton']);

  return (
    <CallArrangement
      complianceBannerProps={{ strings }}
      // Ignore errors from before current call. This avoids old errors from showing up when a user re-joins a call.
      errorBarProps={props.options?.errorBar !== false && { ...errorBarProps, ignorePremountErrors: true }}
      callControlProps={{
        options: callControlOptions,
        increaseFlyoutItemSize: props.mobileView
      }}
      mobileView={props.mobileView}
      /* @conditional-compile-remove(one-to-n-calling) */
      modalLayerHostId={props.modalLayerHostId}
      onRenderGalleryContent={() => (
        <LobbyTile {...lobbyProps} overlayProps={overlayProps(strings, inLobby, Object.values(participants))} />
      )}
      dataUiId={'lobby-page'}
    />
  );
};

const overlayProps = (
  strings: CallCompositeStrings,
  inLobby: boolean,
  remoteParticipants: RemoteParticipantState[]
): LobbyOverlayProps => {
  /**
   * Only grab the first participant because there will only be one in this situation.
   * when starting a call with multiple people the call goes to the connected state and composite goes directly to
   * videoGallery.
   *
   * We also need to check the participant state since in a group call the remote participants array will populate just before
   * the user joins. In this situation we also check the participant states. in a groupCall the state of the participants
   * will be 'Idle'.
   */
  const outboundCallParticipant: RemoteParticipantState | undefined =
    remoteParticipants[0] &&
    ['Ringing', 'Connecting'].includes(remoteParticipants[0].state) &&
    remoteParticipants.length === 1
      ? remoteParticipants[0]
      : undefined;

  return inLobby
    ? overlayPropsWaitingToBeAdmitted(strings)
    : outboundCallParticipant
    ? overlayPropsOutboundCall(strings, outboundCallParticipant)
    : overlayPropsConnectingToCall(strings);
};

const overlayPropsConnectingToCall = (strings: CallCompositeStrings): LobbyOverlayProps => ({
  title: strings.lobbyScreenConnectingToCallTitle,
  moreDetails: strings.lobbyScreenConnectingToCallMoreDetails,
  overlayIcon: <CallCompositeIcon iconName="LobbyScreenConnectingToCall" />
});

const overlayPropsWaitingToBeAdmitted = (strings: CallCompositeStrings): LobbyOverlayProps => ({
  title: strings.lobbyScreenWaitingToBeAdmittedTitle,
  moreDetails: strings.lobbyScreenWaitingToBeAdmittedMoreDetails,
  overlayIcon: <CallCompositeIcon iconName="LobbyScreenWaitingToBeAdmitted" />
});

const overlayPropsOutboundCall = (
  strings: CallCompositeStrings,
  participant: RemoteParticipantState
): LobbyOverlayProps => {
  if (isPhoneNumberIdentifier(participant.identifier)) {
    return {
      title: (participant.identifier as PhoneNumberIdentifier).phoneNumber,
      moreDetails: outboundCallStringsTrampoline(strings)
    };
  } else {
    return {
      title: outboundCallStringsTrampoline(strings)
    };
  }
};

const outboundCallStringsTrampoline = (strings: CallCompositeStrings): string => {
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  return strings.outboundCallingNoticeString;
  return '';
};

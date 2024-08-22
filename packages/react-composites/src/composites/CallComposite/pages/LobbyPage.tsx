// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { ActiveErrorMessage, ErrorBar } from '@internal/react-components';
/* @conditional-compile-remove(notifications) */
import { ActiveNotification } from '@internal/react-components';
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
import { CallCompositeIcon } from '../../common/icons';
import { isPhoneNumberIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
import { RemoteParticipantState } from '@internal/calling-stateful-client';
import { MobileChatSidePaneTabHeaderProps } from '../../common/TabHeader';
import { SidePaneRenderer } from '../components/SidePane/SidePaneProvider';

import { CapabilitiesChangeNotificationBarProps } from '../components/CapabilitiesChangedNotificationBar';

/**
 * @private
 */
export interface LobbyPageProps {
  mobileView: boolean;
  modalLayerHostId: string;
  options?: CallCompositeOptions;
  mobileChatTabHeader: MobileChatSidePaneTabHeaderProps | undefined;
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  latestErrors: ActiveErrorMessage[] | /* @conditional-compile-remove(notifications) */ ActiveNotification[];
  /* @conditional-compile-remove(notifications) */
  latestNotifications: ActiveNotification[];
  onDismissError: (
    error: ActiveErrorMessage | /* @conditional-compile-remove(notifications) */ ActiveNotification
  ) => void;
  /* @conditional-compile-remove(notifications) */
  onDismissNotification: (notification: ActiveNotification) => void;
  capabilitiesChangedNotificationBarProps?: CapabilitiesChangeNotificationBarProps;
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

  // Reduce the controls shown when mobile view is enabled.
  let callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  callControlOptions = disableCallControls(callControlOptions, ['screenShareButton', 'participantsButton']);

  return (
    <CallArrangement
      complianceBannerProps={{ strings }}
      errorBarProps={props.options?.errorBar !== false && errorBarProps}
      /* @conditional-compile-remove(notifications) */
      showErrorNotifications={props.options?.errorBar ?? true}
      callControlProps={{
        options: callControlOptions,
        increaseFlyoutItemSize: props.mobileView
      }}
      mobileView={props.mobileView}
      modalLayerHostId={props.modalLayerHostId}
      onRenderGalleryContent={() => (
        <LobbyTile
          {...lobbyProps}
          showLocalVideoCameraCycleButton={props.mobileView}
          overlayProps={overlayProps(strings, inLobby, Object.values(participants))}
        />
      )}
      dataUiId={'lobby-page'}
      updateSidePaneRenderer={props.updateSidePaneRenderer}
      mobileChatTabHeader={props.mobileChatTabHeader}
      latestErrors={props.latestErrors}
      onDismissError={props.onDismissError}
      /* @conditional-compile-remove(notifications) */
      latestNotifications={props.latestNotifications}
      /* @conditional-compile-remove(notifications) */
      onDismissNotification={props.onDismissNotification}
      /* @conditional-compile-remove(call-readiness) */
      doNotShowCameraAccessNotifications={props.options?.deviceChecks?.camera === 'doNotPrompt'}
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
      moreDetails: strings.outboundCallingNoticeString
    };
  } else {
    return {
      title: strings.outboundCallingNoticeString ?? ''
    };
  }
};

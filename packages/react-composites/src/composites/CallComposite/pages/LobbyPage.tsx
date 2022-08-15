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
import { CallControlOptions } from '../types/CallControlOptions';
import { CallCompositeStrings } from '../Strings';
import { useLocale } from '../../localization';
import { useLocalVideoStartTrigger } from '../components/MediaGallery';
import { CallCompositeIcon } from '../../common/icons';

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

  useLocalVideoStartTrigger(lobbyProps.localParticipantVideoStream.isAvailable, inLobby);

  // Reduce the controls shown when mobile view is enabled.
  let callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  callControlOptions = disableLobbyPageControls(callControlOptions);

  return (
    <CallArrangement
      complianceBannerProps={{ strings }}
      errorBarProps={props.options?.errorBar !== false && { ...errorBarProps }}
      callControlProps={{
        options: callControlOptions,
        increaseFlyoutItemSize: props.mobileView
      }}
      mobileView={props.mobileView}
      /* @conditional-compile-remove(one-to-n-calling) */
      modalLayerHostId={props.modalLayerHostId}
      onRenderGalleryContent={() => <LobbyTile {...lobbyProps} overlayProps={overlayProps(strings, inLobby)} />}
      dataUiId={'lobby-page'}
    />
  );
};

const disableLobbyPageControls = (
  callControlOptions: CallControlOptions | boolean | undefined
): CallControlOptions | boolean | undefined => {
  // Ensure we clone the prop if it is an object to ensure we do not mutate the original prop.
  let newOptions = callControlOptions instanceof Object ? { ...callControlOptions } : callControlOptions;
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
  inLobby ? overlayPropsWaitingToBeAdmitted(strings) : overlayPropsConnectingToCall(strings);

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

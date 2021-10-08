// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OnRenderAvatarCallback, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { useEffect, useRef } from 'react';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { BaseComposite, BaseCompositeProps } from '../common/BaseComposite';
import { CallCompositeIcons } from '../common/icons';
import { useLocale } from '../localization';
import { CallAdapter } from './adapter/CallAdapter';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallControlOptions } from './components/CallControls';
import { CallPage } from './pages/CallPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { NoticePage } from './pages/NoticePage';
import { useSelector } from './hooks/useSelector';
import { getCallId, getCallStatus, getEndedCall, getPage } from './selectors/baseSelectors';
import { LobbyPage } from './pages/LobbyPage';
import { isInCall } from './utils';

// @TODO: where are these defined? - these part of our Call Adapter contract.
const ACCESS_DENIED_TEAMS_MEETING_SUB_CODE = 5854;
const REMOVED_FROM_CALL_SUB_CODES = [5000, 5300];

/**
 * Props for {@link CallComposite}.
 *
 * @public
 */
export interface CallCompositeProps extends BaseCompositeProps<CallCompositeIcons> {
  /**
   * An adapter provides logic and data to the composite.
   * Composite can also be controlled using the adapter.
   */
  adapter: CallAdapter;
  callInvitationUrl?: string;
  /**
   * A callback function that can be used to provide custom data to an Avatar.
   */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  /**
   * Flags to enable/disable or customize UI elements of the {@link CallComposite}.
   */
  options?: CallCompositeOptions;
}

/**
 * Optional features of the {@link CallComposite}.
 *
 * @public
 */
export type CallCompositeOptions = {
  /**
   * Choose to use the composite form optimized for use on a mobile device.
   * @remarks This is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue false
   * @alpha
   */
  mobileView?: boolean;
  /**
   * Surface Azure Communication Services backend errors in the UI with {@link @azure/communication-react#ErrorBar}.
   * Hide or show the error bar.
   * @defaultValue true
   */
  errorBar?: boolean;
  /**
   * Hide or Customize the control bar element.
   * Can be customized by providing an object of type {@link @azure/communication-react#CallControlOptions}.
   * @defaultValue true
   */
  callControls?: boolean | CallControlOptions;
};

type MainScreenProps = {
  onRenderAvatar?: OnRenderAvatarCallback;
  callInvitationUrl?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: CallCompositeOptions;
};

const MainScreen = (props: MainScreenProps): JSX.Element => {
  const { callInvitationUrl, onRenderAvatar, onFetchAvatarPersonaData, onFetchParticipantMenuItems } = props;
  const page = useSelector(getPage);
  const adapter = useAdapter();
  const callState = useSelector(getCallStatus);
  const locale = useLocale();
  const endedCall = useSelector(getEndedCall);
  const callId = useSelector(getCallId);
  const currentCallId = useRef('');

  // Update page based on call state
  useEffect(() => {
    if (['Connecting', 'Ringing', 'InLobby'].includes(callState ?? 'None')) {
      adapter.setPage('lobby');
    } else if (isInCall(callState)) {
      adapter.setPage('call');
    }
  }, [adapter, callState]);

  // Remember last available callId to compare against when the call ends.
  if (callId) {
    currentCallId.current = callId;
  }
  // Update page if the caller is no longer in a call
  useEffect(() => {
    if (endedCall && currentCallId.current === endedCall?.id && endedCall?.callEndReason?.code === 0) {
      if (endedCall?.callEndReason.subCode === ACCESS_DENIED_TEAMS_MEETING_SUB_CODE) {
        adapter.setPage('accessDeniedTeamsMeeting');
      } else if (REMOVED_FROM_CALL_SUB_CODES.includes[endedCall?.callEndReason.subCode ?? -1]) {
        adapter.setPage('removedFromCall');
      } else {
        //@TODO: when call ended page is implemented: adapter.setPage('leftCall');
      }
    }
  }, [adapter, endedCall]);

  switch (page) {
    case 'configuration':
      return (
        <ConfigurationPage
          mobileView={props.options?.mobileView ?? false}
          startCallHandler={(): void => {
            adapter.joinCall();
          }}
        />
      );
    case 'accessDeniedTeamsMeeting':
      return (
        <NoticePage
          title={locale.strings.call.failedToJoinTeamsMeetingReasonAccessDeniedTitleMessage}
          moreDetails={locale.strings.call.failedToJoinTeamsMeetingReasonAccessDeniedMoreDetails}
        />
      );
    case 'removedFromCall':
      return (
        <NoticePage
          title={locale.strings.call.removedFromMeetingTitleMessage}
          moreDetails={locale.strings.call.removedFromMeetingMoreDetailsMessage}
        />
      );
    case 'lobby':
      return <LobbyPage endCallHandler={() => adapter.setPage('configuration')} />;
    case 'call':
      return (
        <CallPage
          endCallHandler={() => adapter.setPage('configuration')}
          onRenderAvatar={onRenderAvatar}
          callInvitationURL={callInvitationUrl}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          options={props.options}
        />
      );
    default:
      throw new Error('Invalid call composite page');
  }
};

/**
 * A customizable UI composite for calling experience.
 *
 * @public
 */
export const CallComposite = (props: CallCompositeProps): JSX.Element => {
  const { adapter, callInvitationUrl, onFetchAvatarPersonaData, onFetchParticipantMenuItems, options } = props;
  useEffect(() => {
    (async () => {
      await adapter.askDevicePermission({ video: true, audio: true });
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [adapter]);
  return (
    <BaseComposite {...props}>
      <CallAdapterProvider adapter={adapter}>
        <MainScreen
          callInvitationUrl={callInvitationUrl}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          options={options}
        />
      </CallAdapterProvider>
    </BaseComposite>
  );
};

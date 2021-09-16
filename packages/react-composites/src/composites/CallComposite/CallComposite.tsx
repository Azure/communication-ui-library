// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OnRenderAvatarCallback, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { useEffect } from 'react';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { BaseComposite, BaseCompositeProps } from '../common/BaseComposite';
import { CallCompositeIcons } from '../common/icons';
import { useLocale } from '../localization';
import { CallAdapter, CallCompositePage } from './adapter/CallAdapter';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallControlHiddenElements } from './CallControls';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { Error } from './Error';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';

export interface CallCompositeProps extends BaseCompositeProps<CallCompositeIcons> {
  /**
   * An adapter provides logic and data to the composite.
   * Composite can also be controlled using the adapter.
   */
  adapter: CallAdapter;
  callInvitationURL?: string;

  /**
   * A callback function that can be used to provide custom data to an Avatar.
   */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;

  /**
   * Flags to hide UI elements of the {@link CallComposite}.
   */
  hiddenElements?: CallCompositeHiddenElements;
}

/**
 * Optional features of the {@link CallComposite}
 */
export type CallCompositeHiddenElements = CallControlHiddenElements & {
  /**
   * Surface Azure Communication Services backend errors in the UI with {@link @azure/communication-react#ErrorBar}.
   * Hidden if set to `true`
   *
   * @defaultValuefalse
   */
  errorBar?: boolean;
  /**
   * Hide call controls during a call if set to `true`
   * @defaultValuefalse
   */
  callControls?: boolean;
};

type MainScreenProps = {
  onRenderAvatar?: OnRenderAvatarCallback;
  callInvitationURL?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  hiddenElements?: CallCompositeHiddenElements;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
};

const MainScreen = (props: MainScreenProps): JSX.Element => {
  const { callInvitationURL, onRenderAvatar, onFetchAvatarPersonaData, onFetchParticipantMenuItems } = props;
  const page = useSelector(getPage);
  const adapter = useAdapter();
  const locale = useLocale();
  switch (page) {
    case 'configuration':
      return <ConfigurationScreen startCallHandler={(): void => adapter.setPage('call')} />;
    case 'error':
      return <Error rejoinHandler={() => adapter.setPage('configuration')} />;
    case 'errorJoiningTeamsMeeting':
      return (
        <Error
          rejoinHandler={() => adapter.setPage('configuration')}
          title={locale.strings.call.teamsMeetingFailToJoin}
          reason={locale.strings.call.teamsMeetingFailReasonAccessDenied}
        />
      );
    case 'removed':
      return (
        <Error
          rejoinHandler={() => adapter.setPage('configuration')}
          title={locale.strings.call.teamsMeetingFailToJoin}
          reason={locale.strings.call.teamsMeetingFailReasonParticipantRemoved}
        />
      );
    default:
      return (
        <CallScreen
          endCallHandler={async (): Promise<void> => {
            adapter.setPage('configuration');
          }}
          callErrorHandler={(customPage?: CallCompositePage) => {
            customPage ? adapter.setPage(customPage) : adapter.setPage('error');
          }}
          onRenderAvatar={onRenderAvatar}
          callInvitationURL={callInvitationURL}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          hiddenElements={props.hiddenElements}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
        />
      );
  }
};

export const CallComposite = (props: CallCompositeProps): JSX.Element => {
  const { adapter, callInvitationURL, onFetchAvatarPersonaData, hiddenElements, onFetchParticipantMenuItems } = props;
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
          callInvitationURL={callInvitationURL}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          hiddenElements={hiddenElements}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
        />
      </CallAdapterProvider>
    </BaseComposite>
  );
};

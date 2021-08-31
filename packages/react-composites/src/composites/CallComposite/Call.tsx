// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { OnRenderAvatarCallback } from '@internal/react-components';
import React, { useEffect } from 'react';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { BaseComposite, BaseCompositeProps } from '../common/Composite';
import { useLocale } from '../localization';
import { CallAdapter, CallCompositePage } from './adapter/CallAdapter';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { Error } from './Error';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';

export interface CallCompositeProps extends BaseCompositeProps {
  /**
   * An adapter provides logic and data to the composite.
   * Composite can also be controlled using the adapter.
   */
  adapter: CallAdapter;
  callInvitationURL?: string;
}

type MainScreenProps = {
  showCallControls: boolean;
  onRenderAvatar?: OnRenderAvatarCallback;
  callInvitationURL?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
};

const MainScreen = (props: MainScreenProps): JSX.Element => {
  const { showCallControls, callInvitationURL, onRenderAvatar, onFetchAvatarPersonaData } = props;
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
          showCallControls={showCallControls}
          endCallHandler={async (): Promise<void> => {
            adapter.setPage('configuration');
          }}
          callErrorHandler={(customPage?: CallCompositePage) => {
            customPage ? adapter.setPage(customPage) : adapter.setPage('error');
          }}
          onRenderAvatar={onRenderAvatar}
          callInvitationURL={callInvitationURL}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
        />
      );
  }
};

export const Call = (props: CallCompositeProps): JSX.Element => {
  return (
    <BaseComposite {...props}>
      <CallCompositeInternal {...props} showCallControls={true} />
    </BaseComposite>
  );
};

/**
 * Props for the internal-only call composite export that has extra customizability points that
 * we are not ready to export publicly.
 * @internal
 */
interface CallInternalProps extends CallCompositeProps {
  showCallControls: boolean;
}

/**
 * An internal-only call composite export.
 * This is used by the meeting composite and has extra customizability points that we are not ready
 * to export publicly.
 * @internal
 */
export const CallCompositeInternal = (props: CallInternalProps): JSX.Element => {
  const { adapter, callInvitationURL, onFetchAvatarPersonaData } = props;

  useEffect(() => {
    (async () => {
      await adapter.askDevicePermission({ video: true, audio: true });
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [adapter]);

  return (
    <CallAdapterProvider adapter={adapter}>
      <MainScreen
        showCallControls={props.showCallControls}
        callInvitationURL={callInvitationURL}
        onFetchAvatarPersonaData={onFetchAvatarPersonaData}
      />
    </CallAdapterProvider>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { Error } from './Error';
import { Theme, PartialTheme } from '@fluentui/react';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallAdapter, CallCompositePage } from './adapter/CallAdapter';
import { PlaceholderProps } from '@internal/react-components';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';
import { FluentThemeProvider } from '@internal/react-components';

export type CallCompositeProps = {
  adapter: CallAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  callInvitationURL?: string;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  options?: CallOptions;
};

/**
 * Additional customizations for the call composite
 */
export type CallOptions = {
  /**
   * Choose to hide the whole call control bar
   * @defaultValue false
   */
  hideCallControls?: boolean;
  /**
   * Choose to hide the screen share button
   * @defaultValue false
   */
  hideScreenShareControl?: boolean;
  /**
   * Choose to hide the participants button
   * @defaultValue false
   */
  hideParticipantsControl?: boolean;
};

type MainScreenProps = {
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  callInvitationURL?: string;
  callOptions?: CallOptions;
};

const MainScreen = ({ callInvitationURL, onRenderAvatar, callOptions }: MainScreenProps): JSX.Element => {
  const page = useSelector(getPage);
  const adapter = useAdapter();
  switch (page) {
    case 'configuration':
      return <ConfigurationScreen startCallHandler={(): void => adapter.setPage('call')} />;
    case 'error':
      return <Error rejoinHandler={() => adapter.setPage('configuration')} />;
    case 'errorJoiningTeamsMeeting':
      return (
        <Error
          rejoinHandler={() => adapter.setPage('configuration')}
          title="Error joining Teams Meeting"
          reason="Access to the Teams meeting was denied."
        />
      );
    case 'removed':
      return (
        <Error
          rejoinHandler={() => adapter.setPage('configuration')}
          title="Oops! You are no longer a participant of the call."
          reason="Access to the meeting has been stopped"
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
          showControlBar={!callOptions?.hideCallControls}
          showParticipantsButton={!callOptions?.hideParticipantsControl}
          showScreenShareButton={!callOptions?.hideScreenShareControl}
          callInvitationURL={callInvitationURL}
        />
      );
  }
};

export const Call = (props: CallCompositeProps): JSX.Element => {
  const { adapter } = props;

  useEffect(() => {
    (async () => {
      await adapter.askDevicePermission({ video: true, audio: true });
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [adapter]);

  return (
    <FluentThemeProvider fluentTheme={props.fluentTheme}>
      <CallAdapterProvider adapter={adapter}>
        <MainScreen
          onRenderAvatar={props.onRenderAvatar}
          callInvitationURL={props.callInvitationURL}
          callOptions={props.options}
        />
      </CallAdapterProvider>
    </FluentThemeProvider>
  );
};

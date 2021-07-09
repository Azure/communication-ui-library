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
  onRenderPane?: () => JSX.Element;
  showParticipantsButton?: boolean;
  showSideChatButton?: boolean;
  showSidePeopleButton?: boolean;
  chatButtonChecked?: boolean;
  peopleButtonChecked?: boolean;
  onChatButtonClick?: () => void;
  onPeopleButtonClick?: () => void;
};

type MainScreenProps = {
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  onRenderPane?: () => JSX.Element;
  callInvitationURL?: string;
  showParticipantsButton?: boolean;
  showSideChatButton?: boolean;
  showSidePeopleButton?: boolean;
  chatButtonChecked?: boolean;
  peopleButtonChecked?: boolean;
  onChatButtonClick?: () => void;
  onPeopleButtonClick?: () => void;
};

const MainScreen = ({
  callInvitationURL,
  showParticipantsButton,
  onRenderAvatar,
  onRenderPane,
  showSideChatButton,
  showSidePeopleButton,
  chatButtonChecked,
  peopleButtonChecked,
  onChatButtonClick,
  onPeopleButtonClick
}: MainScreenProps): JSX.Element => {
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
          onRenderPane={onRenderPane}
          showParticipantsButton={showParticipantsButton}
          callInvitationURL={callInvitationURL}
          showSideChatButton={showSideChatButton}
          showSidePeopleButton={showSidePeopleButton}
          chatButtonChecked={chatButtonChecked}
          peopleButtonChecked={peopleButtonChecked}
          onChatButtonClick={onChatButtonClick}
          onPeopleButtonClick={onPeopleButtonClick}
        />
      );
  }
};

export const Call = (props: CallCompositeProps): JSX.Element => {
  const {
    adapter,
    callInvitationURL,
    fluentTheme,
    onRenderPane,
    showParticipantsButton,
    showSideChatButton,
    showSidePeopleButton,
    chatButtonChecked,
    peopleButtonChecked,
    onChatButtonClick,
    onPeopleButtonClick
  } = props;

  useEffect(() => {
    (async () => {
      await adapter.askDevicePermission({ video: true, audio: true });
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [adapter]);

  return (
    <FluentThemeProvider fluentTheme={fluentTheme}>
      <CallAdapterProvider adapter={adapter}>
        <MainScreen
          onRenderAvatar={props.onRenderAvatar}
          onRenderPane={onRenderPane}
          callInvitationURL={callInvitationURL}
          showParticipantsButton={showParticipantsButton}
          showSideChatButton={showSideChatButton}
          showSidePeopleButton={showSidePeopleButton}
          chatButtonChecked={chatButtonChecked}
          peopleButtonChecked={peopleButtonChecked}
          onChatButtonClick={onChatButtonClick}
          onPeopleButtonClick={onPeopleButtonClick}
        />
      </CallAdapterProvider>
    </FluentThemeProvider>
  );
};

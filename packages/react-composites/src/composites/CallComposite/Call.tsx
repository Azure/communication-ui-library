// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { Error } from './Error';
import { mergeStyles, Stack, Theme, PartialTheme, useTheme } from '@fluentui/react';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallAdapter, CallCompositePage } from './adapter/CallAdapter';
import { PlaceholderProps } from 'react-components';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';
import { FluentThemeProvider, LocalizationProps } from 'react-components';

export type CallCompositeProps = {
  adapter: CallAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * pprabhu comment: Works by using a LocalicationProvider internally, but key is that customers can override the
   * strings for each component or just choose locale, and don't have to bother with the provider.
   *
   * Customers can also skip this entirely, and get en-us.
   */
  localization?: LocalizationProps;

  callInvitationURL?: string;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
};

type MainScreenProps = {
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  screenWidth: number;
  callInvitationURL?: string;
};

const MainScreen = ({ screenWidth, callInvitationURL, onRenderAvatar }: MainScreenProps): JSX.Element => {
  const page = useSelector(getPage);
  const adapter = useAdapter();
  switch (page) {
    case 'configuration':
      return <ConfigurationScreen screenWidth={screenWidth} startCallHandler={(): void => adapter.setPage('call')} />;
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
          screenWidth={screenWidth}
          showParticipants={true}
          callInvitationURL={callInvitationURL}
        />
      );
  }
};

export const Call = (props: CallCompositeProps): JSX.Element => {
  const [screenWidth, setScreenWidth] = useState(window?.innerWidth ?? 0);
  const theme = useTheme();

  useEffect(() => {
    const setWindowWidth = (): void => {
      const width = typeof window !== 'undefined' ? window.innerWidth : 0;
      setScreenWidth(width);
    };
    setWindowWidth();
    window.addEventListener('resize', setWindowWidth);
    return () => window.removeEventListener('resize', setWindowWidth);
  }, []);

  const { adapter, callInvitationURL, fluentTheme } = props;

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
        <Stack className={callContainerStyle(theme)} grow>
          <MainScreen
            screenWidth={screenWidth}
            onRenderAvatar={props.onRenderAvatar}
            callInvitationURL={callInvitationURL}
          />
        </Stack>
      </CallAdapterProvider>
    </FluentThemeProvider>
  );
};

export const callContainerStyle = (theme: Theme): string => {
  return mergeStyles({
    height: '100%',
    width: '100%',
    overflow: 'auto',
    minHeight: '30rem',
    minWidth: '50rem',
    boxShadow: theme.effects.elevation4
  });
};

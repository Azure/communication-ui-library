// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { Error } from './Error';
import { Theme, PartialTheme } from '@fluentui/react';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallAdapter, CallCompositePage } from './adapter/CallAdapter';
import { IdentifierProvider, Identifiers, PlaceholderProps } from '@internal/react-components';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';
import { FluentThemeProvider, LocalizationProvider, Locale } from '@internal/react-components';

export type CallCompositeProps = {
  adapter: CallAdapter;
  /**
   * Fluent theme for the composite.
   *
   * @defaultValue `light theme`
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Locale for the composite.
   *
   * @defaultValue `English (US)`
   */
  locale?: Locale;
  callInvitationURL?: string;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  options?: CallOptions;
  identifiers?: Identifiers;
};

/**
 * Additional customizations for the chat composite
 */
export type CallOptions = {
  /**
   * UNSTABLE: Feature flag for the local stream to be in a PIP (picture in picture) floating on the bottom right corner.
   *
   * This option will be removed once VideoGallery is stable.
   * @experimental
   *
   * @defaultValue "default"
   */
  showFloatingVideo?: string;
};

type MainScreenProps = {
  showCallControls: boolean;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  callInvitationURL?: string;
  options?: CallOptions;
};

const MainScreen = ({ showCallControls, callInvitationURL, onRenderAvatar, options }: MainScreenProps): JSX.Element => {
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
          showCallControls={showCallControls}
          endCallHandler={async (): Promise<void> => {
            adapter.setPage('configuration');
          }}
          callErrorHandler={(customPage?: CallCompositePage) => {
            customPage ? adapter.setPage(customPage) : adapter.setPage('error');
          }}
          onRenderAvatar={onRenderAvatar}
          callInvitationURL={callInvitationURL}
          localStreamLayout={options?.showFloatingVideo}
        />
      );
  }
};

export const Call = (props: CallCompositeProps): JSX.Element => {
  return <CallCompositeInternal {...props} showCallControls={true} />;
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
  const { adapter, callInvitationURL, fluentTheme, locale, identifiers, options } = props;

  useEffect(() => {
    (async () => {
      await adapter.askDevicePermission({ video: true, audio: true });
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [adapter]);

  const callElement = (
    <FluentThemeProvider fluentTheme={fluentTheme}>
      <IdentifierProvider identifiers={identifiers}>
        <CallAdapterProvider adapter={adapter}>
          <MainScreen
            showCallControls={props.showCallControls}
            onRenderAvatar={props.onRenderAvatar}
            callInvitationURL={callInvitationURL}
            options={options}
          />
        </CallAdapterProvider>
      </IdentifierProvider>
    </FluentThemeProvider>
  );

  return locale ? LocalizationProvider({ locale, children: callElement }) : callElement;
};

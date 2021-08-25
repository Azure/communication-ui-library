// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialTheme, registerIcons, Theme } from '@fluentui/react';
import {
  FluentThemeProvider,
  IdentifierProvider,
  Identifiers,
  LocalizationProvider,
  OnRenderAvatarCallback
} from '@internal/react-components';
import React, { useEffect } from 'react';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { DefaultCompositeIcons, defaultCompositeIcons } from '../common/icons';
import { CompositeLocale, useLocale } from '../localization';
import { CallAdapter, CallCompositePage } from './adapter/CallAdapter';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallScreen } from './CallScreen';
import { ConfigurationScreen } from './ConfigurationScreen';
import { Error } from './Error';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';

export type CallCompositeProps = {
  adapter: CallAdapter;
  /**
   * Fluent theme for the composite.
   *
   * @defaultValue light theme
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Custom Icon override for the composite.
   * A JSX element can be provided to override the default icon.
   */
  icons?: DefaultCompositeIcons;
  /**
   * Whether composite is displayed right-to-left.
   *
   * @defaultValue false
   */
  rtl?: boolean;
  /**
   * Locale for the composite.
   *
   * @defaultValue English (US)
   */
  locale?: CompositeLocale;
  callInvitationURL?: string;
  identifiers?: Identifiers;
  /**
   * A callback function that can be used to provide custom data to an Avatar.
   */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
};

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
  /**
   * We register the defaul icon mappings to ensure all icons render.
   */
  registerIcons(props.icons ? { icons: props.icons } : { icons: defaultCompositeIcons });
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
  const { adapter, callInvitationURL, fluentTheme, rtl, locale, identifiers, onFetchAvatarPersonaData } = props;

  useEffect(() => {
    (async () => {
      await adapter.askDevicePermission({ video: true, audio: true });
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [adapter]);

  const callElement = (
    <FluentThemeProvider fluentTheme={fluentTheme} rtl={rtl}>
      <IdentifierProvider identifiers={identifiers}>
        <CallAdapterProvider adapter={adapter}>
          <MainScreen
            showCallControls={props.showCallControls}
            callInvitationURL={callInvitationURL}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          />
        </CallAdapterProvider>
      </IdentifierProvider>
    </FluentThemeProvider>
  );

  return locale ? LocalizationProvider({ locale, children: callElement }) : callElement;
};

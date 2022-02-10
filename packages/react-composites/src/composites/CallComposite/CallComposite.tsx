// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall } from '@internal/calling-component-bindings';
import { OnRenderAvatarCallback, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { useEffect, useMemo } from 'react';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { BaseComposite, BaseCompositeProps } from '../common/BaseComposite';
import { CallCompositeIcons } from '../common/icons';
import { useLocale } from '../localization';
import { CallAdapter } from './adapter/CallAdapter';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallPage } from './pages/CallPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { NoticePage } from './pages/NoticePage';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';
import { LobbyPage } from './pages/LobbyPage';
import { mainScreenContainerStyleDesktop, mainScreenContainerStyleMobile } from './styles/CallComposite.styles';
import { CallControlOptions } from './types/CallControlOptions';

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
  /**
   * Optimizes the composite form factor for either desktop or mobile.
   * @remarks `mobile` is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue 'desktop'
   */
  formFactor?: 'desktop' | 'mobile';
  /**
   * URL to invite new participants to the current call. If this is supplied, a button appears in the Participants
   * Button flyout menu.
   */
  callInvitationUrl?: string;
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
  mobileView: boolean;
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
  const locale = useLocale();

  switch (page) {
    case 'configuration':
      return (
        <ConfigurationPage
          mobileView={props.mobileView}
          startCallHandler={(): void => {
            adapter.joinCall();
          }}
        />
      );
    case 'accessDeniedTeamsMeeting':
      return (
        <NoticePage
          iconName="NoticePageAccessDeniedTeamsMeeting"
          title={locale.strings.call.failedToJoinTeamsMeetingReasonAccessDeniedTitle}
          moreDetails={locale.strings.call.failedToJoinTeamsMeetingReasonAccessDeniedMoreDetails}
          dataUiId={'access-denied-teams-meeting-page'}
        />
      );
    case 'removedFromCall':
      return (
        <NoticePage
          iconName="NoticePageRemovedFromCall"
          title={locale.strings.call.removedFromCallTitle}
          moreDetails={locale.strings.call.removedFromCallMoreDetails}
          dataUiId={'removed-from-call-page'}
        />
      );
    case 'joinCallFailedDueToNoNetwork':
      return (
        <NoticePage
          iconName="NoticePageJoinCallFailedDueToNoNetwork"
          title={locale.strings.call.failedToJoinCallDueToNoNetworkTitle}
          moreDetails={locale.strings.call.failedToJoinCallDueToNoNetworkMoreDetails}
          dataUiId={'join-call-failed-due-to-no-network-page'}
        />
      );
    case 'leftCall':
      return (
        <NoticePage
          iconName="NoticePageLeftCall"
          title={locale.strings.call.leftCallTitle}
          moreDetails={locale.strings.call.leftCallMoreDetails}
          dataUiId={'left-call-page'}
        />
      );
    case 'lobby':
      return <LobbyPage mobileView={props.mobileView} options={props.options} />;
    case 'call':
      return (
        <CallPage
          onRenderAvatar={onRenderAvatar}
          callInvitationURL={callInvitationUrl}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          mobileView={props.mobileView}
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
 * @remarks Call composite min width/height are as follow:
 * - mobile: 19.5rem x 21rem (312px x 336px, with default rem at 16px)
 * - desktop: 30rem x 22rem (480px x 352px, with default rem at 16px)
 *
 * @public
 */
export const CallComposite = (props: CallCompositeProps): JSX.Element => {
  const {
    adapter,
    callInvitationUrl,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    options,
    formFactor = 'desktop'
  } = props;
  useEffect(() => {
    (async () => {
      await adapter.askDevicePermission({ video: true, audio: true });
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [adapter]);

  const mobileView = formFactor === 'mobile';

  const mainScreenContainerClassName = useMemo(() => {
    return mobileView ? mainScreenContainerStyleMobile : mainScreenContainerStyleDesktop;
  }, [mobileView]);

  return (
    <div className={mainScreenContainerClassName}>
      <BaseComposite {...props}>
        <CallAdapterProvider adapter={adapter}>
          <MainScreen
            callInvitationUrl={callInvitationUrl}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            onFetchParticipantMenuItems={onFetchParticipantMenuItems}
            mobileView={mobileView}
            options={options}
          />
        </CallAdapterProvider>
      </BaseComposite>
    </div>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _isInCall } from '@internal/calling-component-bindings';
import { OnRenderAvatarCallback, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { useEffect, useMemo } from 'react';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { BaseProvider, BaseCompositeProps } from '../common/BaseComposite';
import { CallCompositeIcons } from '../common/icons';
import { useLocale } from '../localization';
import { CommonCallAdapter } from './adapter/CallAdapter';
import { CallAdapterProvider, useAdapter } from './adapter/CallAdapterProvider';
import { CallPage } from './pages/CallPage';
import { ConfigurationPage } from './pages/ConfigurationPage';
import { NoticePage } from './pages/NoticePage';
import { useSelector } from './hooks/useSelector';
import { getPage } from './selectors/baseSelectors';
/* @conditional-compile-remove(rooms) */
import { getRole } from './selectors/baseSelectors';
import { LobbyPage } from './pages/LobbyPage';
import { mainScreenContainerStyleDesktop, mainScreenContainerStyleMobile } from './styles/CallComposite.styles';
import { CallControlOptions } from './types/CallControlOptions';

/* @conditional-compile-remove(rooms) */
import { _PermissionsProvider, Role, _getPermissions } from '@internal/react-components';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { LayerHost, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { modalLayerHostStyle } from '../common/styles/ModalLocalAndRemotePIP.styles';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { useId } from '@fluentui/react-hooks';
/* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
import { HoldPage } from './pages/HoldPage';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowserPage } from './pages/UnsupportedBrowser';
import { PermissionConstraints } from '@azure/communication-calling';
import { InjectedSidePaneProps, SidePaneProvider, useSidePaneContext } from './components/SidePane/SidePaneProvider';
import { MobileChatSidePaneTabHeaderProps } from '../common/TabHeader';

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
  adapter: CommonCallAdapter;
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

/* @conditional-compile-remove(call-readiness) */
/**
 * Device Checks.
 * Choose whether or not to block starting a call depending on camera and microphone permission options.
 *
 * @beta
 */
export interface DeviceCheckOptions {
  /**
   * Camera Permission prompts for your call.
   * 'required' - requires the permission to be allowed before permitting the user join the call.
   * 'optional' - permission can be disallowed and the user is still permitted to join the call.
   * 'doNotPrompt' - permission is not required and the user is not prompted to allow the permission.
   */
  camera: 'required' | 'optional' | 'doNotPrompt';
  /**
   * Microphone permission prompts for your call.
   * 'required' - requires the permission to be allowed before permitting the user join the call.
   * 'optional' - permission can be disallowed and the user is still permitted to join the call.
   * 'doNotPrompt' - permission is not required and the user is not prompted to allow the permission.
   */
  microphone: 'required' | 'optional' | 'doNotPrompt';
}

/* @conditional-compile-remove(pinned-participants) */
/**
 * Menu options for remote video tiles in {@link VideoGallery}.
 *
 * @beta
 */
export interface RemoteVideoTileMenuOptions {
  /**
   * If set to true, remote video tiles in the VideoGallery will not have menu options
   *
   * @defaultValue false
   */
  isHidden?: boolean;
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
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Device permissions check options for your call.
   * Here you can choose what device permissions you prompt the user for,
   * as well as what device permissions must be accepted before starting a call.
   */
  deviceChecks?: DeviceCheckOptions;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Callback you may provide to supply users with further steps to troubleshoot why they have been
   * unable to grant your site the required permissions for the call.
   *
   * @example
   * ```ts
   * onPermissionsTroubleshootingClick: () =>
   *  window.open('https://contoso.com/permissions-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'further troubleshooting' link.
   */
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Callback you may provide to supply users with further steps to troubleshoot why they have been
   * having network issues when connecting to the call.
   *
   * @example
   * ```ts
   * onNetworkingTroubleShootingClick?: () =>
   *  window.open('https://contoso.com/network-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'network troubleshooting' link.
   */
  onNetworkingTroubleShootingClick?: () => void;
  /* @conditional-compile-remove(unsupported-browser) */
  /**
   * Callback you may provide to supply users with a provided page to showcase supported browsers by ACS.
   *
   * @example
   * ```ts
   * onBrowserTroubleShootingClick?: () =>
   *  window.open('https://contoso.com/browser-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a unsupported browser page.
   */
  onEnvironmentInfoTroubleshootingClick?: () => void;
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * Remote participant video tile menu options
   */
  remoteVideoTileMenu?: RemoteVideoTileMenuOptions;
};

type MainScreenProps = {
  mobileView: boolean;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) @conditional-compile-remove(call-readiness) */
  modalLayerHostId: string;
  onRenderAvatar?: OnRenderAvatarCallback;
  callInvitationUrl?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: CallCompositeOptions;
  /* @conditional-compile-remove(rooms) */
  roleHint?: Role;
  overrideSidePane?: InjectedSidePaneProps;
  onSidePaneIdChange?: (sidePaneId: string | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
};

const MainScreen = (props: MainScreenProps): JSX.Element => {
  const { callInvitationUrl, onRenderAvatar, onFetchAvatarPersonaData, onFetchParticipantMenuItems } = props;
  const page = useSelector(getPage);

  const { activeSidePaneId, setOverrideSidePane, setActiveSidePaneId, setHeaderRenderer, setContentRenderer } =
    useSidePaneContext();
  useEffect(() => {
    setOverrideSidePane(props.overrideSidePane);
    if (props.overrideSidePane && activeSidePaneId) {
      setActiveSidePaneId(undefined);
      setHeaderRenderer(undefined);
      setContentRenderer(undefined);
    }
  }, [
    activeSidePaneId,
    props.overrideSidePane,
    setActiveSidePaneId,
    setContentRenderer,
    setHeaderRenderer,
    setOverrideSidePane
  ]);

  const onSidePaneIdChange = props.onSidePaneIdChange;
  useEffect(() => {
    onSidePaneIdChange?.(activeSidePaneId);
  }, [activeSidePaneId, onSidePaneIdChange]);

  const adapter = useAdapter();
  const locale = useLocale();

  /* @conditional-compile-remove(rooms) */
  const role = useSelector(getRole);

  let pageElement: JSX.Element | undefined;
  /* @conditional-compile-remove(rooms) */
  switch (page) {
    case 'roomNotFound':
      pageElement = (
        <NoticePage
          iconName="NoticePageInvalidRoom"
          title={locale.strings.call.roomNotFoundTitle}
          moreDetails={locale.strings.call.roomNotFoundDetails}
          dataUiId={'room-not-found-page'}
        />
      );
      break;
    case 'deniedPermissionToRoom':
      pageElement = (
        <NoticePage
          iconName="NoticePageInvalidRoom"
          title={locale.strings.call.deniedPermissionToRoomTitle}
          moreDetails={locale.strings.call.deniedPermissionToRoomDetails}
          dataUiId={'not-invited-to-room-page'}
        />
      );
      break;
  }
  switch (page) {
    case 'configuration':
      pageElement = (
        <ConfigurationPage
          mobileView={props.mobileView}
          startCallHandler={(): void => {
            adapter.joinCall();
          }}
          /* @conditional-compile-remove(call-readiness) */
          modalLayerHostId={props.modalLayerHostId}
          /* @conditional-compile-remove(call-readiness) */
          deviceChecks={props.options?.deviceChecks}
          /* @conditional-compile-remove(call-readiness) */
          onPermissionsTroubleshootingClick={props.options?.onPermissionsTroubleshootingClick}
          /* @conditional-compile-remove(call-readiness) */
          onNetworkingTroubleShootingClick={props.options?.onNetworkingTroubleShootingClick}
        />
      );
      break;
    case 'accessDeniedTeamsMeeting':
      pageElement = (
        <NoticePage
          iconName="NoticePageAccessDeniedTeamsMeeting"
          title={locale.strings.call.failedToJoinTeamsMeetingReasonAccessDeniedTitle}
          moreDetails={locale.strings.call.failedToJoinTeamsMeetingReasonAccessDeniedMoreDetails}
          dataUiId={'access-denied-teams-meeting-page'}
        />
      );
      break;
    case 'removedFromCall':
      pageElement = (
        <NoticePage
          iconName="NoticePageRemovedFromCall"
          title={locale.strings.call.removedFromCallTitle}
          moreDetails={locale.strings.call.removedFromCallMoreDetails}
          dataUiId={'removed-from-call-page'}
        />
      );
      break;
    case 'joinCallFailedDueToNoNetwork':
      pageElement = (
        <NoticePage
          iconName="NoticePageJoinCallFailedDueToNoNetwork"
          title={locale.strings.call.failedToJoinCallDueToNoNetworkTitle}
          moreDetails={locale.strings.call.failedToJoinCallDueToNoNetworkMoreDetails}
          dataUiId={'join-call-failed-due-to-no-network-page'}
        />
      );
      break;
    case 'leftCall':
      pageElement = (
        <NoticePage
          iconName="NoticePageLeftCall"
          title={locale.strings.call.leftCallTitle}
          moreDetails={locale.strings.call.leftCallMoreDetails}
          dataUiId={'left-call-page'}
        />
      );
      break;
    case 'lobby':
      pageElement = (
        <LobbyPage
          mobileView={props.mobileView}
          /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
        />
      );
      break;
    case 'call':
      pageElement = (
        <CallPage
          onRenderAvatar={onRenderAvatar}
          callInvitationURL={callInvitationUrl}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          mobileView={props.mobileView}
          /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          mobileChatTabHeader={props.mobileChatTabHeader}
        />
      );
      break;
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    case 'hold':
      pageElement = (
        <>
          {<HoldPage mobileView={props.mobileView} modalLayerHostId={props.modalLayerHostId} options={props.options} />}
        </>
      );
      break;
  }

  /* @conditional-compile-remove(unsupported-browser) */
  switch (page) {
    case 'unsupportedEnvironment':
      pageElement = (
        <>
          {
            /* @conditional-compile-remove(unsupported-browser) */
            <UnsupportedBrowserPage
              onTroubleshootingClick={props.options?.onEnvironmentInfoTroubleshootingClick}
              environmentInfo={adapter.getState().environmentInfo}
            />
          }
        </>
      );
      break;
  }

  if (!pageElement) {
    throw new Error('Invalid call composite page');
  }

  /* @conditional-compile-remove(rooms) */
  const permissions = _getPermissions(role === 'Unknown' || role === undefined ? props.roleHint : role);

  // default retElement for stable version
  let retElement = pageElement;
  /* @conditional-compile-remove(rooms) */
  retElement = <_PermissionsProvider permissions={permissions}>{pageElement}</_PermissionsProvider>;

  return retElement;
};

/**
 * A customizable UI composite for calling experience.
 *
 * @remarks Call composite min width/height are as follow:
 * - mobile: 17.5rem x 21rem (280px x 336px, with default rem at 16px)
 * - desktop: 30rem x 22rem (480px x 352px, with default rem at 16px)
 *
 * @public
 */
export const CallComposite = (props: CallCompositeProps): JSX.Element => <CallCompositeInner {...props} />;

/**
 * @private
 */
export interface InternalCallCompositeProps {
  overrideSidePane?: InjectedSidePaneProps;
  onSidePaneIdChange?: (sidePaneId: string | undefined) => void;

  // legacy property to avoid breaking change
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
}

/** @private */
export const CallCompositeInner = (props: CallCompositeProps & InternalCallCompositeProps): JSX.Element => {
  const {
    adapter,
    callInvitationUrl,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    options,
    formFactor = 'desktop'
  } = props;

  /* @conditional-compile-remove(rooms) */
  const roleHint = adapter.getState().roleHint;

  useEffect(() => {
    (async () => {
      const constrain = getQueryOptions({
        /* @conditional-compile-remove(rooms) */ role: roleHint
      });
      await adapter.askDevicePermission(constrain);
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [adapter, /* @conditional-compile-remove(rooms) */ roleHint]);

  const mobileView = formFactor === 'mobile';

  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  const modalLayerHostId = useId('modalLayerhost');

  const mainScreenContainerClassName = useMemo(() => {
    return mobileView ? mainScreenContainerStyleMobile : mainScreenContainerStyleDesktop;
  }, [mobileView]);

  return (
    <div className={mainScreenContainerClassName}>
      <BaseProvider {...props}>
        <CallAdapterProvider adapter={adapter}>
          <SidePaneProvider>
            <MainScreen
              callInvitationUrl={callInvitationUrl}
              onFetchAvatarPersonaData={onFetchAvatarPersonaData}
              onFetchParticipantMenuItems={onFetchParticipantMenuItems}
              mobileView={mobileView}
              /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) @conditional-compile-remove(call-readiness) */
              modalLayerHostId={modalLayerHostId}
              options={options}
              /* @conditional-compile-remove(rooms) */
              roleHint={roleHint}
              onSidePaneIdChange={props.onSidePaneIdChange}
              overrideSidePane={props.overrideSidePane}
              mobileChatTabHeader={props.mobileChatTabHeader}
            />
            {
              // This layer host is for ModalLocalAndRemotePIP in SidePane. This LayerHost cannot be inside the SidePane
              // because when the SidePane is hidden, ie. style property display is 'none', it takes up no space. This causes problems when dragging
              // the Modal because the draggable bounds thinks it has no space and will always return to its initial position after dragging.
              // Additionally, this layer host cannot be in the Call Arrangement as it needs to be rendered before useMinMaxDragPosition() in
              // common/utils useRef is called.
              // Warning: this is fragile and works because the call arrangement page is only rendered after the call has connected and thus this
              // LayerHost will be guaranteed to have rendered (and subsequently mounted in the DOM). This ensures the DOM element will be available
              // before the call to `document.getElementById(modalLayerHostId)` is made.
              /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) @conditional-compile-remove(call-readiness) */
              <LayerHost id={modalLayerHostId} className={mergeStyles(modalLayerHostStyle)} />
            }
          </SidePaneProvider>
        </CallAdapterProvider>
      </BaseProvider>
    </div>
  );
};

const getQueryOptions = (options: { /* @conditional-compile-remove(rooms) */ role?: Role }): PermissionConstraints => {
  /* @conditional-compile-remove(rooms) */
  if (options.role === 'Consumer') {
    return {
      video: false,
      audio: true
    };
  }
  return { video: true, audio: true };
};

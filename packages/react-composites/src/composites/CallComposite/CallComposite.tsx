// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _isInCall } from '@internal/calling-component-bindings';
import { ActiveErrorMessage, ErrorBar, ParticipantMenuItemsCallback, useTheme } from '@internal/react-components';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { getEndedCall, getPage } from './selectors/baseSelectors';
import { LobbyPage } from './pages/LobbyPage';
/* @conditional-compile-remove(call-transfer) */
import { TransferPage } from './pages/TransferPage';
import {
  leavingPageStyle,
  mainScreenContainerStyleDesktop,
  mainScreenContainerStyleMobile
} from './styles/CallComposite.styles';
import { CallControlOptions } from './types/CallControlOptions';

import { LayerHost, mergeStyles } from '@fluentui/react';
import { modalLayerHostStyle } from '../common/styles/ModalLocalAndRemotePIP.styles';
import { useId } from '@fluentui/react-hooks';
/* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(PSTN-calls) */
import { HoldPage } from './pages/HoldPage';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowserPage } from './pages/UnsupportedBrowser';
import { PermissionConstraints } from '@azure/communication-calling';
/* @conditional-compile-remove(rooms) */
import { ParticipantRole } from '@azure/communication-calling';
import { MobileChatSidePaneTabHeaderProps } from '../common/TabHeader';
import { InjectedSidePaneProps, SidePaneProvider, SidePaneRenderer } from './components/SidePane/SidePaneProvider';
import {
  filterLatestErrors,
  getEndedCallPageProps,
  trackErrorAsDismissed,
  updateTrackedErrorsWithActiveErrors
} from './utils';
import { TrackedErrors } from './types/ErrorTracking';
import { usePropsFor } from './hooks/usePropsFor';
import { deviceCountSelector } from './selectors/deviceCountSelector';
/* @conditional-compile-remove(gallery-layouts) */
import { VideoGalleryLayout } from '@internal/react-components';
/* @conditional-compile-remove(capabilities) */
import { capabilitiesChangedInfoAndRoleSelector } from './selectors/capabilitiesChangedInfoAndRoleSelector';
/* @conditional-compile-remove(capabilities) */
import { useTrackedCapabilityChangedNotifications } from './utils/TrackCapabilityChangedNotifications';

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
 * @public
 */
export interface RemoteVideoTileMenuOptions {
  /**
   * If set to true, remote video tiles in the VideoGallery will not have menu options
   *
   * @defaultValue false
   */
  isHidden?: boolean;
}

/* @conditional-compile-remove(click-to-call) */ /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(vertical-gallery) */
/**
 * Options for the local video tile in the Call composite.
 *
 * @beta
 */
export interface LocalVideoTileOptions {
  /**
   * Position of the local video tile. If unset will render the local tile in the floating local position.
   *
   * @defaultValue 'floating'
   * @remarks 'grid' - local video tile will be rendered in the grid view of the videoGallery.
   * 'floating' - local video tile will be rendered in the floating position and will observe overflow gallery
   * local video tile rules and be docked in the bottom corner.
   * This does not affect the Configuration screen or the side pane Picture in Picture in Picture view.
   */
  position?: 'grid' | 'floating';
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
  remoteVideoTileMenuOptions?: RemoteVideoTileMenuOptions;
  /* @conditional-compile-remove(click-to-call) */
  /**
   * Options for controlling the local video tile.
   *
   * @remarks if 'false' the local video tile will not be rendered.
   */
  localVideoTile?: boolean | LocalVideoTileOptions;
  /* @conditional-compile-remove(gallery-layouts) */
  /**
   * Options for controlling the starting layout of the composite's video gallery
   */
  galleryOptions?: {
    /**
     * Layout for the gallery when the call starts
     */
    layout?: VideoGalleryLayout;
  };
  /* @conditional-compile-remove(custom-branding) */
  /**
   * Options for setting additional customizations related to personalized branding.
   */
  branding?: {
    /**
     * Logo displayed on the configuration page.
     */
    logo?: {
      /**
       * URL for the logo image.
       *
       * @remarks
       * Recommended size is 80x80 pixels.
       */
      url: string;
      /**
       * Alt text for the logo image.
       */
      alt?: string;
      /**
       * The logo can be displayed as a circle or a square.
       *
       * @defaultValue 'unset'
       */
      shape?: 'unset' | 'square';
    };
    /* @conditional-compile-remove(custom-branding) */
    /**
     * Background image displayed on the configuration page.
     */
    backgroundImage?: {
      /**
       * URL for the background image.
       *
       * @remarks
       * Background image should be larger than 576x567 pixels and smaller than 2048x2048 pixels pixels.
       */
      url: string;
    };
  };
};

type MainScreenProps = {
  mobileView: boolean;
  modalLayerHostId: string;
  callInvitationUrl?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: CallCompositeOptions;
  overrideSidePane?: InjectedSidePaneProps;
  onSidePaneIdChange?: (sidePaneId: string | undefined) => void;
  mobileChatTabHeader?: MobileChatSidePaneTabHeaderProps;
  onCloseChatPane?: () => void;
};

const isShowing = (overrideSidePane?: InjectedSidePaneProps): boolean => {
  return !!overrideSidePane?.isActive;
};

const MainScreen = (props: MainScreenProps): JSX.Element => {
  const adapter = useAdapter();
  const { camerasCount, microphonesCount } = useSelector(deviceCountSelector);
  const hasCameras = camerasCount > 0;
  const hasMicrophones = microphonesCount > 0;

  useEffect(() => {
    (async () => {
      const constrain = getQueryOptions({
        /* @conditional-compile-remove(rooms) */ role: adapter.getState().call?.role
      });
      await adapter.askDevicePermission(constrain);
      adapter.queryCameras();
      adapter.queryMicrophones();
      adapter.querySpeakers();
    })();
  }, [
    adapter,
    // Ensure we re-ask for permissions if the number of devices goes from 0 -> n during a call
    // as we cannot request permissions when there are no devices.
    hasCameras,
    hasMicrophones
  ]);

  const { callInvitationUrl, onFetchAvatarPersonaData, onFetchParticipantMenuItems } = props;
  const page = useSelector(getPage);
  const endedCall = useSelector(getEndedCall);

  const [sidePaneRenderer, setSidePaneRenderer] = React.useState<SidePaneRenderer | undefined>();
  const [injectedSidePaneProps, setInjectedSidePaneProps] = React.useState<InjectedSidePaneProps>();

  /* @conditional-compile-remove(gallery-layouts) */
  const [userSetGalleryLayout, setUserSetGalleryLayout] = useState<VideoGalleryLayout>(
    props.options?.galleryOptions?.layout ?? 'floatingLocalVideo'
  );
  /* @conditional-compile-remove(gallery-layouts) */
  const [userSetOverflowGalleryPosition, setUserSetOverflowGalleryPosition] = useState<'Responsive' | 'horizontalTop'>(
    'Responsive'
  );

  const overridePropsRef = useRef<InjectedSidePaneProps | undefined>(props.overrideSidePane);
  useEffect(() => {
    setInjectedSidePaneProps(props.overrideSidePane);
    // When the injected side pane is opened, clear the previous side pane active state.
    // this ensures when the injected side pane is "closed", the previous side pane is not "re-opened".
    if (!isShowing(overridePropsRef.current) && isShowing(props.overrideSidePane)) {
      setSidePaneRenderer(undefined);
    }
    overridePropsRef.current = props.overrideSidePane;
  }, [props.overrideSidePane]);

  const onSidePaneIdChange = props.onSidePaneIdChange;
  useEffect(() => {
    onSidePaneIdChange?.(sidePaneRenderer?.id);
  }, [sidePaneRenderer?.id, onSidePaneIdChange]);

  /* @conditional-compile-remove(capabilities) */
  const capabilitiesChangedInfoAndRole = useSelector(capabilitiesChangedInfoAndRoleSelector);

  /* @conditional-compile-remove(capabilities) */
  const capabilitiesChangedNotificationBarProps =
    useTrackedCapabilityChangedNotifications(capabilitiesChangedInfoAndRole);

  // Track the last dismissed errors of any error kind to prevent errors from re-appearing on subsequent page navigation
  // This works by tracking the most recent timestamp of any active error type.
  // And then tracking when that error type was last dismissed.
  const activeErrors = usePropsFor(ErrorBar).activeErrorMessages;
  const [trackedErrors, setTrackedErrors] = useState<TrackedErrors>({} as TrackedErrors);
  useEffect(() => {
    setTrackedErrors((prev) => updateTrackedErrorsWithActiveErrors(prev, activeErrors));
  }, [activeErrors]);
  const onDismissError = useCallback((error: ActiveErrorMessage) => {
    setTrackedErrors((prev) => trackErrorAsDismissed(error.type, prev));
  }, []);
  const latestErrors = useMemo(() => filterLatestErrors(activeErrors, trackedErrors), [activeErrors, trackedErrors]);

  const locale = useLocale();
  const palette = useTheme().palette;
  const leavePageStyle = useMemo(() => leavingPageStyle(palette), [palette]);

  let pageElement: JSX.Element | undefined;
  switch (page) {
    case 'configuration':
      pageElement = (
        <ConfigurationPage
          mobileView={props.mobileView}
          startCallHandler={(): void => {
            adapter.joinCall({
              microphoneOn: 'keep',
              cameraOn: 'keep'
            });
          }}
          updateSidePaneRenderer={setSidePaneRenderer}
          latestErrors={latestErrors}
          onDismissError={onDismissError}
          modalLayerHostId={props.modalLayerHostId}
          /* @conditional-compile-remove(call-readiness) */
          deviceChecks={props.options?.deviceChecks}
          /* @conditional-compile-remove(call-readiness) */
          onPermissionsTroubleshootingClick={props.options?.onPermissionsTroubleshootingClick}
          /* @conditional-compile-remove(call-readiness) */
          onNetworkingTroubleShootingClick={props.options?.onNetworkingTroubleShootingClick}
          /* @conditional-compile-remove(capabilities) */
          capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
          /* @conditional-compile-remove(custom-branding) */
          logo={props.options?.branding?.logo}
          /* @conditional-compile-remove(custom-branding) */
          backgroundImage={props.options?.branding?.backgroundImage}
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
    case 'leaving':
      pageElement = (
        <NoticePage
          title={locale.strings.call.leavingCallTitle ?? 'Leaving...'}
          dataUiId={'leaving-page'}
          pageStyle={leavePageStyle}
          disableStartCallButton={true}
        />
      );
      break;
    case 'leftCall': {
      const { title, moreDetails, disableStartCallButton, iconName } = getEndedCallPageProps(locale, endedCall);
      pageElement = (
        <NoticePage
          iconName={iconName}
          title={title}
          moreDetails={moreDetails}
          dataUiId={'left-call-page'}
          disableStartCallButton={disableStartCallButton}
        />
      );
      break;
    }
    case 'lobby':
      pageElement = (
        <LobbyPage
          mobileView={props.mobileView}
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          updateSidePaneRenderer={setSidePaneRenderer}
          mobileChatTabHeader={props.mobileChatTabHeader}
          latestErrors={latestErrors}
          onDismissError={onDismissError}
          /* @conditional-compile-remove(capabilities) */
          capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
        />
      );
      break;
    /* @conditional-compile-remove(call-transfer) */
    case 'transferring':
      pageElement = (
        <TransferPage
          mobileView={props.mobileView}
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          updateSidePaneRenderer={setSidePaneRenderer}
          mobileChatTabHeader={props.mobileChatTabHeader}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          latestErrors={latestErrors}
          onDismissError={onDismissError}
          /* @conditional-compile-remove(capabilities) */
          capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
        />
      );
      break;
    case 'call':
      pageElement = (
        <CallPage
          callInvitationURL={callInvitationUrl}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          mobileView={props.mobileView}
          modalLayerHostId={props.modalLayerHostId}
          options={props.options}
          updateSidePaneRenderer={setSidePaneRenderer}
          mobileChatTabHeader={props.mobileChatTabHeader}
          onCloseChatPane={props.onCloseChatPane}
          latestErrors={latestErrors}
          onDismissError={onDismissError}
          /* @conditional-compile-remove(gallery-layouts) */
          galleryLayout={userSetGalleryLayout}
          /* @conditional-compile-remove(gallery-layouts) */
          onUserSetGalleryLayoutChange={setUserSetGalleryLayout}
          /* @conditional-compile-remove(gallery-layouts) */
          onSetUserSetOverflowGalleryPosition={setUserSetOverflowGalleryPosition}
          /* @conditional-compile-remove(gallery-layouts) */
          userSetOverflowGalleryPosition={userSetOverflowGalleryPosition}
          /* @conditional-compile-remove(capabilities) */
          capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
        />
      );
      break;
    /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
    case 'hold':
      pageElement = (
        <>
          {
            <HoldPage
              mobileView={props.mobileView}
              modalLayerHostId={props.modalLayerHostId}
              options={props.options}
              updateSidePaneRenderer={setSidePaneRenderer}
              mobileChatTabHeader={props.mobileChatTabHeader}
              latestErrors={latestErrors}
              onDismissError={onDismissError}
              /* @conditional-compile-remove(capabilities) */
              capabilitiesChangedNotificationBarProps={capabilitiesChangedNotificationBarProps}
            />
          }
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

  return (
    <SidePaneProvider sidePaneRenderer={sidePaneRenderer} overrideSidePane={injectedSidePaneProps}>
      {pageElement}
    </SidePaneProvider>
  );
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
  onCloseChatPane?: () => void;
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

  const mobileView = formFactor === 'mobile';

  const modalLayerHostId = useId('modalLayerhost');
  const mainScreenContainerClassName = useMemo(() => {
    return mobileView ? mainScreenContainerStyleMobile : mainScreenContainerStyleDesktop;
  }, [mobileView]);

  return (
    <div className={mainScreenContainerClassName}>
      <BaseProvider {...props}>
        <CallAdapterProvider adapter={adapter}>
          <MainScreen
            callInvitationUrl={callInvitationUrl}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            onFetchParticipantMenuItems={onFetchParticipantMenuItems}
            mobileView={mobileView}
            modalLayerHostId={modalLayerHostId}
            options={options}
            onSidePaneIdChange={props.onSidePaneIdChange}
            overrideSidePane={props.overrideSidePane}
            mobileChatTabHeader={props.mobileChatTabHeader}
            onCloseChatPane={props.onCloseChatPane}
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
            <LayerHost id={modalLayerHostId} className={mergeStyles(modalLayerHostStyle)} />
          }
        </CallAdapterProvider>
      </BaseProvider>
    </div>
  );
};

const getQueryOptions = (options: {
  /* @conditional-compile-remove(rooms) */ role?: ParticipantRole;
}): PermissionConstraints => {
  /* @conditional-compile-remove(rooms) */
  if (options.role === 'Consumer') {
    return {
      video: false,
      audio: true
    };
  }
  return { video: true, audio: true };
};

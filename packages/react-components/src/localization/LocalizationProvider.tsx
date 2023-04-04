// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import {
  CameraButtonStrings,
  EndCallButtonStrings,
  ErrorBarStrings,
  MessageStatusIndicatorStrings,
  MessageThreadStrings,
  MicrophoneButtonStrings,
  DevicesButtonStrings,
  ParticipantsButtonStrings,
  ParticipantItemStrings,
  ScreenShareButtonStrings,
  SendBoxStrings,
  TypingIndicatorStrings,
  VideoGalleryStrings,
  _StartCaptionsButtonStrings,
  _CaptionsSettingModalStrings
} from '../components';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButtonStrings } from '../components';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
import { DialpadStrings } from '../components';
/* @conditional-compile-remove(call-readiness) */
import { SitePermissionsStrings } from '../components/DevicePermissions/SitePermissionsScaffolding';
/* @conditional-compile-remove(call-readiness) */
import { BrowserPermissionDeniedStrings } from '../components/DevicePermissions/BrowserPermissionDenied';
/* @conditional-compile-remove(call-readiness) */
import { BrowserPermissionDeniedIOSStrings } from '../components/DevicePermissions/BrowserPermissionDeniedIOS';
/* @conditional-compile-remove(call-readiness) */ /* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowserStrings } from '../components/UnsupportedBrowser';
/* @conditional-compile-remove(one-to-n-calling) */
// @conditional-compile-remove(PSTN-calls)
import { VideoTileStrings } from '../components/VideoTile';
import { COMPONENT_LOCALE_EN_US } from './locales';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowserVersionStrings } from '../components/UnsupportedBrowserVersion';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedOperatingSystemStrings } from '../components/UnsupportedOperatingSystem';
/* @conditional-compile-remove(vertical-gallery) */
import { VerticalGalleryStrings } from '../components/VerticalGallery';

/**
 * Locale information for all components exported from this library.
 *
 * @public
 */
export interface ComponentLocale {
  /** Strings for components */
  strings: ComponentStrings;
  /* @conditional-compile-remove(date-time-customization) */
  /**
   * Optional function to provide customized date format.
   * @beta
   */
  onDisplayDateTimeString?: (messageDate: Date) => string;
}

/**
 * Strings used by all components exported from this library.
 *
 * @public
 */
export interface ComponentStrings {
  /** Strings for MessageThread */
  messageThread: MessageThreadStrings;
  /** Strings for ParticipantItem */
  participantItem: ParticipantItemStrings;
  /** Strings for CameraButton */
  cameraButton: CameraButtonStrings;
  /** Strings for MicrophoneButton */
  microphoneButton: MicrophoneButtonStrings;
  /** Strings for EndCallButton */
  endCallButton: EndCallButtonStrings;
  /** Strings for DevicesButton */
  devicesButton: DevicesButtonStrings;
  /** Strings for ParticipantsButton */
  participantsButton: ParticipantsButtonStrings;
  /** Strings for ScreenShareButton */
  screenShareButton: ScreenShareButtonStrings;
  /** Strings for TypingIndicator */
  typingIndicator: TypingIndicatorStrings;
  /** Strings for SendBox */
  sendBox: SendBoxStrings;
  /** Strings for MessageStatusIndicator */
  messageStatusIndicator: MessageStatusIndicatorStrings;
  /** Strings for ErroBar */
  errorBar: ErrorBarStrings;
  /** Strings for VideoGallery */
  videoGallery: VideoGalleryStrings;
  /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
  /** Strings for Dialpad */
  dialpad: DialpadStrings;
  /* @conditional-compile-remove(one-to-n-calling) */
  // @conditional-compile-remove(PSTN-calls)
  /** Strings for VideoTile */
  videoTile: VideoTileStrings;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /** Strings for HoldButton */
  holdButton: HoldButtonStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission request prompt */
  CameraAndMicrophoneSitePermissionsRequest: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission request prompt */
  CameraSitePermissionsRequest: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission request prompt */
  MicrophoneSitePermissionsRequest: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission generic checking prompt */
  CameraAndMicrophoneSitePermissionsCheck: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission generic checking prompt */
  CameraSitePermissionsCheck: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission generic checking prompt */
  MicrophoneSitePermissionsCheck: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission denied prompt */
  CameraAndMicrophoneSitePermissionsDenied: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission denied prompt for safari browsers*/
  CameraAndMicrophoneSitePermissionsDeniedSafari: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission denied prompt */
  CameraSitePermissionsDenied: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission denied prompt */
  MicrophoneSitePermissionsDenied: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission denied prompt for safari browsers*/
  CameraSitePermissionsDeniedSafari: SitePermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for a site's permission denied prompt for safari browsers*/
  MicrophoneSitePermissionsDeniedSafari: SitePermissionsStrings;
  /* @conditional-compile-remove(unsupported-browser) */
  /** Strings for unsupported browser UI */
  UnsupportedBrowser: UnsupportedBrowserStrings;
  /* @conditional-compile-remove(unsupported-browser) */
  /** Strings for unsupported browser version UI */
  UnsupportedBrowserVersion: UnsupportedBrowserVersionStrings;
  /* @conditional-compile-remove(unsupported-browser) */
  /** Strings for unsupported browser version UI */
  UnsupportedOperatingSystem: UnsupportedOperatingSystemStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for BrowserPemissionDenied */
  BrowserPermissionDenied: BrowserPermissionDeniedStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for BrowserPemissionDeniedIOS */
  BrowserPermissionDeniedIOS: BrowserPermissionDeniedIOSStrings;
  /* @conditional-compile-remove(vertical-gallery) */
  /**
   * Strings for the VerticalGallery.
   */
  VerticalGallery: VerticalGalleryStrings;
  /** Strings for Start Captions Button */
  startCaptionsButton: _StartCaptionsButtonStrings;
  /** Strings for Captions Setting Modal */
  captionsSettingModal: _CaptionsSettingModalStrings;
}

/**
 * Context for providing localized strings to components exported from this library.
 *
 * @public
 */
export const LocaleContext = createContext<ComponentLocale>(COMPONENT_LOCALE_EN_US);

/**
 * Props for {@link LocalizationProvider}.
 *
 * @public
 */
export type LocalizationProviderProps = {
  /** Locale context to provide components */
  locale: ComponentLocale;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * Provider to provide localized strings for this library's react components.
 *
 * @remarks Components will be provided localized strings in English (US) by default if this
 * provider is not used.
 *
 * @public
 */
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

/** React hook to access locale */
export const useLocale = (): ComponentLocale => useContext(LocaleContext);

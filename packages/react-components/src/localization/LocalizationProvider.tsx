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
  VideoGalleryStrings
} from '../components';
/* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
import { HoldButtonStrings } from '../components';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
import { DialpadStrings } from '../components';
/* @conditional-compile-remove(call-readiness) */
import { DomainPermissionsStrings } from '../components/DevicePermissions/DomainPermissionsScaffolding';
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
  /* @conditional-compile-remove(one-to-n-calling) */ /* @condtional-compile-remove(one-to-n-calling) */
  /** Strings for HoldButton */
  holdButton: HoldButtonStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for DomainPermissions */
  CameraAndMicrophoneDomainPermissions: DomainPermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for DomainPermissions */
  CameraDomainPermissions: DomainPermissionsStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for DomainPermissions */
  MicrophoneDomainPermissions: DomainPermissionsStrings;
  /* @conditional-compile-remove(unsupported-browser) */
  /** Strings for unsupported browser UI */
  UnsupportedBrowser: UnsupportedBrowserStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for BrowserPemissionDenied */
  BrowserPermissionDenied: BrowserPermissionDeniedStrings;
  /* @conditional-compile-remove(call-readiness) */
  /** Strings for BrowserPemissionDeniedIOS */
  BrowserPermissionDeniedIOS: BrowserPermissionDeniedIOSStrings;
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

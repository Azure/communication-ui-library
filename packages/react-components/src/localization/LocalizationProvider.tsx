// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
  CaptionsSettingsModalStrings,
  CaptionsBannerStrings,
  StartCaptionsButtonStrings
} from '../components';
import { NotificationStackStrings } from '../components';
import { RaiseHandButtonStrings } from '../components';
import { HoldButtonStrings } from '../components';
import { DialpadStrings } from '../components';
/* @conditional-compile-remove(call-readiness) */
import { SitePermissionsStrings } from '../components/DevicePermissions/SitePermissionsScaffolding';
/* @conditional-compile-remove(call-readiness) */
import { BrowserPermissionDeniedStrings } from '../components/DevicePermissions/BrowserPermissionDenied';
/* @conditional-compile-remove(call-readiness) */
import { BrowserPermissionDeniedIOSStrings } from '../components/DevicePermissions/BrowserPermissionDeniedIOS';
/* @conditional-compile-remove(call-readiness) */ /* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowserStrings } from '../components/UnsupportedBrowser';
import { VideoTileStrings } from '../components/VideoTile';
import { COMPONENT_LOCALE_EN_US } from './locales';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedBrowserVersionStrings } from '../components/UnsupportedBrowserVersion';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedOperatingSystemStrings } from '../components/UnsupportedOperatingSystem';
import { VerticalGalleryStrings } from '../components/VerticalGallery';
/* @conditional-compile-remove(total-participant-count) */
import { ParticipantListStrings } from '../components/ParticipantList';
/* @conditional-compile-remove(mention) */
import { MentionPopoverStrings } from '../components/MentionPopover';
import { ImageOverlayStrings } from '../components/ImageOverlay';
import { ReactionButtonStrings } from '../components';
/* @conditional-compile-remove(rich-text-editor) */
import { RichTextSendBoxStrings } from '../components/RichTextEditor/RichTextSendBox';
import { MeetingConferencePhoneInfoModalStrings } from '../components/MeetingConferencePhoneInfo';
import { IncomingCallNotificationStrings } from '../components/IncomingCallNotification';
/* @conditional-compile-remove(rtt) */
import { RTTDisclosureBannerStrings } from '../components/RTTDisclosureBanner';
/* @conditional-compile-remove(rtt) */
import { RTTModalStrings } from '../components/RTTModal';
/* @conditional-compile-remove(rtt) */
import { RealTimeTextStrings } from '../components/RealTimeText';
import { CaptionLanguageStrings, SpokenLanguageStrings } from '../types';
/* @conditional-compile-remove(rtt) */
import { StartRealTimeTextButtonStrings } from '../components/StartRealTimeTextButton';

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
  /** Strings for RaiseHandButton */
  raiseHandButton: RaiseHandButtonStrings;
  /**
   * Strings for ReactionButton
   * */
  reactionButton: ReactionButtonStrings;
  /** Strings for TypingIndicator */
  typingIndicator: TypingIndicatorStrings;
  /** Strings for SendBox */
  sendBox: SendBoxStrings;
  /* @conditional-compile-remove(rich-text-editor) */
  /** Strings for RichTextSendBox */
  richTextSendBox: RichTextSendBoxStrings;
  /* @conditional-compile-remove(mention) */
  /** Strings for MentionPopover */
  mentionPopover: MentionPopoverStrings;
  /** Strings for ImageOverlay */
  imageOverlay: ImageOverlayStrings;
  /** Strings for MessageStatusIndicator */
  messageStatusIndicator: MessageStatusIndicatorStrings;
  /** Strings for ErrorBar */
  errorBar: ErrorBarStrings;

  /** Strings for NotificationStack */
  notificationStack: NotificationStackStrings;
  /** Strings for VideoGallery */
  videoGallery: VideoGalleryStrings;
  /** Strings for Dialpad */
  dialpad: DialpadStrings;
  /** Strings for VideoTile */
  videoTile: VideoTileStrings;
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
  /**
   * Strings for the VerticalGallery.
   */
  verticalGallery: VerticalGalleryStrings;
  /* @conditional-compile-remove(total-participant-count) */
  /** Strings for the participant list component */
  ParticipantList: ParticipantListStrings;
  /** Strings for the MeetingConferencePhoneInfoModal */
  meetingConferencePhoneInfo: MeetingConferencePhoneInfoModalStrings;
  IncomingCallNotification: IncomingCallNotificationStrings;
  /* @conditional-compile-remove(rtt) */
  /** Strings for the RTT Disclosure Banner */
  rttDisclosureBanner: RTTDisclosureBannerStrings;
  /* @conditional-compile-remove(rtt) */
  /** Strings for the RTTModal */
  rttModal: RTTModalStrings;
  /* @conditional-compile-remove(rtt) */
  /** Strings for RealTimeText */
  rtt: RealTimeTextStrings;
  /** Strings for Captions Setting Modal */
  captionsSettingsModal: CaptionsSettingsModalStrings;
  /**
   * 1 to 1 mapping between language code and language string for spoken languages
   */
  spokenLanguages: SpokenLanguageStrings;
  /**
   * 1 to 1 mapping between language code and language string for caption languages
   */
  captionLanguages: CaptionLanguageStrings;
  /** Strings for CaptionsBanner */
  captionsBanner: CaptionsBannerStrings;
  /** Strings for Start Captions Button */
  startCaptionsButton: StartCaptionsButtonStrings;
  /* @conditional-compile-remove(rtt) */
  /** Strings for Start RealTimeText Button */
  startRealTimeTextButton: StartRealTimeTextButtonStrings;
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

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
  _DialpadStrings
} from '../components';
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

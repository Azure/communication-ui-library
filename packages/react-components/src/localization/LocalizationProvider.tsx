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
  OptionsButtonStrings,
  ParticipantsButtonStrings,
  ParticipantItemStrings,
  ScreenShareButtonStrings,
  SendBoxStrings,
  TypingIndicatorStrings
} from '../components';
import { ScreenShareStrings } from '../components/VideoGallery';
import { COMPONENT_LOCALE_EN_US } from './locales';

/**
 * Locale information for all components exported from this library.
 *
 * @public
 */
export interface ComponentLocale {
  /** Strings for components */
  strings: ComponentStrings;
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
  /** Strings for OptionsButton */
  optionsButton: OptionsButtonStrings;
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
  /** Strings for ScreenShare */
  screenShare: ScreenShareStrings;
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext } from 'react';
import { CameraButtonStrings } from '../components/CameraButton';
import { EndCallButtonStrings } from '../components/EndCallButton';
import { MessageThreadStrings } from '../components/MessageThread';
import { MicrophoneButtonStrings } from '../components/MicrophoneButton';
import { ParticipantItemStrings } from '../components/ParticipantItem';
import { TypingIndicatorStrings } from '../components/TypingIndicator';
import en_US from './translated/en-US.json';

/**
 * Locale information to change strings in components
 */
export interface Locale {
  /** Strings for MessageThread */
  messageThreadStrings: MessageThreadStrings;
  /** Strings for ParticipantItem */
  participantItemStrings: ParticipantItemStrings;
  /** Strings for CameraButton */
  cameraButtonStrings: CameraButtonStrings;
  /** Strings for MicrophoneButton */
  microphoneButtonStrings: MicrophoneButtonStrings;
  /** Strings for EndCallButton */
  endCallButtonStrings: EndCallButtonStrings;
  /** Strings for TypingIndicator */
  typingIndicatorStrings: TypingIndicatorStrings;
}

/**
 * Context for providing localized strings to components
 */
export const LocaleContext = createContext<Locale>(en_US);

/**
 * Props to LocalizationProvider
 */
export type LocalizationProviderProps = {
  /** Locale context to provide components */
  locale: Locale;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * @description Provider to provide localized strings for this library's react components.
 * @remarks Components will be provided localized strings in English (US) by default if this
 * provider is not used
 */
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): Locale => useContext(LocaleContext);

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext, useState, useEffect } from 'react';
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
import { COMPONENT_LOCALE_EN_US } from './locales';

/**
 * Data structure for localization
 */
export interface ComponentLocale {
  /** Strings for components */
  strings: ComponentStrings;
}

/**
 * Strings for components
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
  /** Strings for OptionsButton */
  screenShareButton: ScreenShareButtonStrings;
  /** Strings for TypingIndicator */
  typingIndicator: TypingIndicatorStrings;
  /** Strings for SendBox */
  sendBox: SendBoxStrings;
  /** Strings for MessageStatusIndicator */
  messageStatusIndicator: MessageStatusIndicatorStrings;
  /** Strings for ErroBar */
  errorBar: ErrorBarStrings;
}

/**
 * Context for providing localized strings to components
 */
export const LocaleContext = createContext<ComponentLocale>(COMPONENT_LOCALE_EN_US);

/**
 * Props to InternalLocalizationProvider
 */
type InternalLocalizationProviderProps = {
  /** Locale context to provide components */
  locale: ComponentLocale;
  /** Children to provide locale context. */
  children: React.ReactNode;
};

/**
 * @description Provider to provide localized strings for this library's react components.
 * @remarks Components will be provided localized strings in English (US) by default if this
 * provider is not used
 */
const InternalLocalizationProvider = (props: InternalLocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

/** React hook to access locale */
export const useLocale = (): ComponentLocale => useContext(LocaleContext);

type AsyncLocalizationProviderProps = {
  localeLoader: () => Promise<ComponentLocale>;
  children: React.ReactNode;
};

const AsyncLocalizationProvider = (props: AsyncLocalizationProviderProps): JSX.Element => {
  const { children, localeLoader } = props;
  const [componentLocale, setComponentLocale] = useState<ComponentLocale>(COMPONENT_LOCALE_EN_US);

  useEffect(() => {
    const intializeLocale = async (): Promise<void> => {
      const componentLocale = await localeLoader();
      setComponentLocale(componentLocale);
    };
    intializeLocale();
  }, [localeLoader]);

  return <InternalLocalizationProvider locale={componentLocale}>{children}</InternalLocalizationProvider>;
};

export const LocalizationProvider = (props: {
  defaultLocale?: string;
  locale: ComponentLocale | (() => Promise<ComponentLocale>);
  children: React.ReactNode;
}): JSX.Element => {
  const { children, locale } = props;
  if (typeof locale === 'function') {
    return AsyncLocalizationProvider({
      localeLoader: locale as () => Promise<ComponentLocale>,
      children
    });
  }
  return InternalLocalizationProvider({ locale, children });
};

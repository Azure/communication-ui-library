// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
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
 * Props to LocalizationProvider
 */
export type LocalizationProviderProps = {
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
export const LocalizationProvider = (props: LocalizationProviderProps): JSX.Element => {
  const { locale, children } = props;
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
};

/** React hook to access locale */
export const useLocale = (): ComponentLocale => useContext(LocaleContext);

interface SetLocaleContext {
  setLocale: (locale?: string) => Promise<void>;
}

const SetLocaleContext = createContext<SetLocaleContext>({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setLocale: async (locale?: string) => {}
});

export const AsyncLocalizationProvider = (props: {
  defaultLocale?: string;
  localeLoader: (locale?: string) => Promise<ComponentLocale>;
  children: React.ReactNode;
}): JSX.Element => {
  const { children, defaultLocale, localeLoader } = props;
  const [componentLocale, setComponentLocale] = useState<ComponentLocale>(COMPONENT_LOCALE_EN_US);

  useEffect(() => {
    const intializeLocale = async (): Promise<void> => {
      const componentLocale = await localeLoader(defaultLocale);
      setComponentLocale(componentLocale);
    };
    intializeLocale();
  }, [defaultLocale, localeLoader]);

  const state = useMemo<SetLocaleContext>(
    () => ({
      setLocale: async (locale?: string): Promise<void> => {
        setComponentLocale(await localeLoader(locale));
      }
    }),
    [localeLoader]
  );

  return (
    <SetLocaleContext.Provider value={state}>
      <LocalizationProvider locale={componentLocale}>{children}</LocalizationProvider>
    </SetLocaleContext.Provider>
  );
};

/**
 * React hook for programmatically accessing the setLocale.
 */
export const useSetLocale = (): SetLocaleContext => useContext(SetLocaleContext);

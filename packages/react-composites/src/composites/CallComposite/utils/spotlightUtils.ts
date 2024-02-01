// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import { useMemo } from 'react';
/* @conditional-compile-remove(spotlight) */
import { CallCompositeStrings } from '../Strings';
/* @conditional-compile-remove(spotlight) */
import { PromptProps } from '../components/Prompt';
/* @conditional-compile-remove(spotlight) */
import { useLocale } from '../../localization';

/* @conditional-compile-remove(spotlight) */
/**
 * @internal
 */
export const useSpotlightCallbacksWithPrompt = (
  myUserId: string,
  onStartSpotlight: (userId: string) => Promise<void>,
  onStopSpotlight: (userId: string) => Promise<void>,
  setIsPromptOpen?: (isOpen: boolean) => void,
  setPromptProps?: (promptProps: PromptProps) => void
): {
  onStartSpotlightWithPrompt: (userId: string) => Promise<void>;
  onStopSpotlightWithPrompt: (userId: string) => Promise<void>;
} => {
  const strings = useLocale().strings.call;

  return useMemo(() => {
    if (!setIsPromptOpen || !setPromptProps) {
      return { onStartSpotlightWithPrompt: onStartSpotlight, onStopSpotlightWithPrompt: onStopSpotlight };
    }
    return {
      onStartSpotlightWithPrompt: getStartSpotlightWithPromptCallback(
        myUserId,
        onStartSpotlight,
        setIsPromptOpen,
        setPromptProps,
        strings
      ),
      onStopSpotlightWithPrompt: getStopSpotlightWithPromptCallback(
        myUserId,
        onStopSpotlight,
        setIsPromptOpen,
        setPromptProps,
        strings
      )
    };
  }, [myUserId, onStartSpotlight, onStopSpotlight, setIsPromptOpen, setPromptProps, strings]);
};

/* @conditional-compile-remove(spotlight) */
const getStartSpotlightWithPromptCallback = (
  myUserId: string,
  onStartSpotlight: (userId: string) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): ((userId: string) => Promise<void>) => {
  return async (userId: string): Promise<void> => {
    const startSpotlightPromptText =
      userId === myUserId
        ? strings.prompt.spotlight.startSpotlightOnSelfText
        : strings.prompt.spotlight.startSpotlightText;
    setPromptProps({
      heading: strings.prompt.spotlight.startSpotlightHeading,
      text: startSpotlightPromptText,
      confirmButtonLabel: strings.prompt.spotlight.startSpotlightConfirmButtonLabel,
      cancelButtonLabel: strings.prompt.spotlight.startSpotlightCancelButtonLabel,
      onConfirm: () => {
        onStartSpotlight(userId);
        setIsPromptOpen(false);
      },
      onCancel: () => setIsPromptOpen(false)
    });
    setIsPromptOpen(true);
  };
};

/* @conditional-compile-remove(spotlight) */
const getStopSpotlightWithPromptCallback = (
  myUserId: string,
  onStopSpotlight: (userId: string) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): ((userId: string) => Promise<void>) => {
  return async (userId: string): Promise<void> => {
    const stopSpotlightPromptHeading =
      userId === myUserId
        ? strings.prompt.spotlight.stopSpotlightOnSelfHeading
        : strings.prompt.spotlight.stopSpotlightHeading;
    const stopSpotlightPromptText =
      userId === myUserId
        ? strings.prompt.spotlight.stopSpotlightOnSelfText
        : strings.prompt.spotlight.stopSpotlightText;
    const stopSpotlightPromptConfirmButtonLabel =
      userId === myUserId
        ? strings.prompt.spotlight.stopSpotlightOnSelfConfirmButtonLabel
        : strings.prompt.spotlight.stopSpotlightConfirmButtonLabel;

    setPromptProps({
      heading: stopSpotlightPromptHeading,
      text: stopSpotlightPromptText,
      confirmButtonLabel: stopSpotlightPromptConfirmButtonLabel,
      cancelButtonLabel: strings.prompt.spotlight.stopSpotlightCancelButtonLabel,
      onConfirm: () => {
        onStopSpotlight(userId);
        setIsPromptOpen(false);
      },
      onCancel: () => setIsPromptOpen(false)
    });
    setIsPromptOpen(true);
  };
};

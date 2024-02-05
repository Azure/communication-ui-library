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
        ? strings.spotlightPrompt.startSpotlightOnSelfText
        : strings.spotlightPrompt.startSpotlightText;
    setPromptProps({
      heading: strings.spotlightPrompt.startSpotlightHeading,
      text: startSpotlightPromptText,
      confirmButtonLabel: strings.spotlightPrompt.startSpotlightConfirmButtonLabel,
      cancelButtonLabel: strings.spotlightPrompt.startSpotlightCancelButtonLabel,
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
        ? strings.spotlightPrompt.stopSpotlightOnSelfHeading
        : strings.spotlightPrompt.stopSpotlightHeading;
    const stopSpotlightPromptText =
      userId === myUserId ? strings.spotlightPrompt.stopSpotlightOnSelfText : strings.spotlightPrompt.stopSpotlightText;
    const stopSpotlightPromptConfirmButtonLabel =
      userId === myUserId
        ? strings.spotlightPrompt.stopSpotlightOnSelfConfirmButtonLabel
        : strings.spotlightPrompt.stopSpotlightConfirmButtonLabel;

    setPromptProps({
      heading: stopSpotlightPromptHeading,
      text: stopSpotlightPromptText,
      confirmButtonLabel: stopSpotlightPromptConfirmButtonLabel,
      cancelButtonLabel: strings.spotlightPrompt.stopSpotlightCancelButtonLabel,
      onConfirm: () => {
        onStopSpotlight(userId);
        setIsPromptOpen(false);
      },
      onCancel: () => setIsPromptOpen(false)
    });
    setIsPromptOpen(true);
  };
};

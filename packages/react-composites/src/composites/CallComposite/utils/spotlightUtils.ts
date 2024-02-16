// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import { useMemo } from 'react';
/* @conditional-compile-remove(spotlight) */
import { CallCompositeStrings } from '../Strings';
/* @conditional-compile-remove(spotlight) */
import { PromptProps } from '../components/Prompt';
/* @conditional-compile-remove(spotlight) */
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
/* @conditional-compile-remove(spotlight) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(spotlight) */
import { useAdapter } from '../adapter/CallAdapterProvider';

/* @conditional-compile-remove(spotlight) */
/**
 * @internal
 */
export const useSpotlightCallbacksWithPrompt = (
  onStartSpotlight: (userIds?: string[]) => Promise<void>,
  onStopSpotlight: (userIds?: string[]) => Promise<void>,
  setIsPromptOpen?: (isOpen: boolean) => void,
  setPromptProps?: (promptProps: PromptProps) => void
): {
  onStartSpotlightWithPrompt: (userIds?: string[]) => Promise<void>;
  onStopSpotlightWithPrompt: (userIds?: string[]) => Promise<void>;
} => {
  const myUserId = toFlatCommunicationIdentifier(useAdapter().getState().userId);

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
  onStartSpotlight: (userIds?: string[]) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): ((userIds?: string[]) => Promise<void>) => {
  return async (userIds?: string[]): Promise<void> => {
    if (userIds && userIds.length > 1) {
      onStartSpotlight(userIds);
    }
    const startSpotlightPromptText =
      userIds === undefined || userIds[0] === myUserId
        ? strings.spotlightPrompt.startSpotlightOnSelfText
        : strings.spotlightPrompt.startSpotlightText;
    setPromptProps({
      heading: strings.spotlightPrompt.startSpotlightHeading,
      text: startSpotlightPromptText,
      confirmButtonLabel: strings.spotlightPrompt.startSpotlightConfirmButtonLabel,
      cancelButtonLabel: strings.spotlightPrompt.startSpotlightCancelButtonLabel,
      onConfirm: () => {
        onStartSpotlight(userIds);
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
  onStopSpotlight: (userIds?: string[]) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): ((userIds?: string[]) => Promise<void>) => {
  return async (userIds?: string[]): Promise<void> => {
    if (userIds && userIds.length > 1) {
      onStopSpotlight(userIds);
    }
    const stopSpotlightPromptHeading =
      userIds === undefined || userIds[0] === myUserId
        ? strings.spotlightPrompt.stopSpotlightOnSelfHeading
        : strings.spotlightPrompt.stopSpotlightHeading;
    const stopSpotlightPromptText =
      userIds === undefined || userIds[0] === myUserId
        ? strings.spotlightPrompt.stopSpotlightOnSelfText
        : strings.spotlightPrompt.stopSpotlightText;
    const stopSpotlightPromptConfirmButtonLabel =
      userIds === undefined || userIds[0] === myUserId
        ? strings.spotlightPrompt.stopSpotlightOnSelfConfirmButtonLabel
        : strings.spotlightPrompt.stopSpotlightConfirmButtonLabel;

    setPromptProps({
      heading: stopSpotlightPromptHeading,
      text: stopSpotlightPromptText,
      confirmButtonLabel: stopSpotlightPromptConfirmButtonLabel,
      cancelButtonLabel: strings.spotlightPrompt.stopSpotlightCancelButtonLabel,
      onConfirm: () => {
        onStopSpotlight(userIds);
        setIsPromptOpen(false);
      },
      onCancel: () => setIsPromptOpen(false)
    });
    setIsPromptOpen(true);
  };
};

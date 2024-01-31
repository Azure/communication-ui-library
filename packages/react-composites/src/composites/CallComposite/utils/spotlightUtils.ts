// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(spotlight) */
import { CallCompositeStrings } from '../Strings';
/* @conditional-compile-remove(spotlight) */
import { PromptProps } from '../components/Prompt';

/* @conditional-compile-remove(spotlight) */
/**
 * @internal
 */
export const getStartSpotlightWithPromptCallback = (
  myUserId: string,
  onStartSpotlight: (userId: string) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  callStrings: CallCompositeStrings
): ((userId: string) => Promise<void>) => {
  return async (userId: string): Promise<void> => {
    const startSpotlightPromptText =
      userId === myUserId
        ? callStrings.prompt.spotlight.startSpotlightOnSelfText
        : callStrings.prompt.spotlight.startSpotlightText;
    setPromptProps({
      heading: callStrings.prompt.spotlight.startSpotlightHeading,
      text: startSpotlightPromptText,
      confirmButtonLabel: callStrings.prompt.spotlight.startSpotlightConfirmButtonLabel,
      cancelButtonLabel: callStrings.prompt.spotlight.startSpotlightCancelButtonLabel,
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
/**
 * @internal
 */
export const getStopSpotlightWithPromptCallback = (
  myUserId: string,
  onStopSpotlight: (userId: string) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  callStrings: CallCompositeStrings
): ((userId: string) => Promise<void>) => {
  return async (userId: string): Promise<void> => {
    const stopSpotlightPromptHeading =
      userId === myUserId
        ? callStrings.prompt.spotlight.stopSpotlightOnSelfHeading
        : callStrings.prompt.spotlight.stopSpotlightHeading;
    const stopSpotlightPromptText =
      userId === myUserId
        ? callStrings.prompt.spotlight.stopSpotlightOnSelfText
        : callStrings.prompt.spotlight.stopSpotlightText;
    const stopSpotlightPromptConfirmButtonLabel =
      userId === myUserId
        ? callStrings.prompt.spotlight.stopSpotlightOnSelfConfirmButtonLabel
        : callStrings.prompt.spotlight.stopSpotlightConfirmButtonLabel;

    setPromptProps({
      heading: stopSpotlightPromptHeading,
      text: stopSpotlightPromptText,
      confirmButtonLabel: stopSpotlightPromptConfirmButtonLabel,
      cancelButtonLabel: callStrings.prompt.spotlight.stopSpotlightCancelButtonLabel,
      onConfirm: () => {
        onStopSpotlight(userId);
        setIsPromptOpen(false);
      },
      onCancel: () => setIsPromptOpen(false)
    });
    setIsPromptOpen(true);
  };
};

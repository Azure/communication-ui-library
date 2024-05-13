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
export const useLocalSpotlightCallbacksWithPrompt = (
  onStartLocalSpotlight?: () => Promise<void>,
  onStopLocalSpotlight?: () => Promise<void>,
  setIsPromptOpen?: (isOpen: boolean) => void,
  setPromptProps?: (promptProps: PromptProps) => void
): {
  onStartLocalSpotlightWithPrompt?: () => Promise<void>;
  onStopLocalSpotlightWithPrompt?: () => Promise<void>;
} => {
  const strings = useLocale().strings.call;

  return useMemo(() => {
    if (!setIsPromptOpen || !setPromptProps) {
      return {
        onStartLocalSpotlightWithPrompt: onStartLocalSpotlight,
        onStopLocalSpotlightWithPrompt: onStopLocalSpotlight
      };
    }
    return {
      onStartLocalSpotlightWithPrompt: onStartLocalSpotlight
        ? getStartLocalSpotlightWithPromptCallback(onStartLocalSpotlight, setIsPromptOpen, setPromptProps, strings)
        : undefined,
      onStopLocalSpotlightWithPrompt: onStopLocalSpotlight
        ? getStopLocalSpotlightWithPromptCallback(onStopLocalSpotlight, setIsPromptOpen, setPromptProps, strings)
        : undefined
    };
  }, [onStartLocalSpotlight, onStopLocalSpotlight, setIsPromptOpen, setPromptProps, strings]);
};

/* @conditional-compile-remove(spotlight) */
const getStartLocalSpotlightWithPromptCallback = (
  onStartSpotlight: (userIds?: string[]) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): ((userIds?: string[]) => Promise<void>) => {
  return async (): Promise<void> => {
    setPromptProps({
      heading: strings.spotlightPrompt.startSpotlightHeading,
      text: strings.spotlightPrompt.startSpotlightOnSelfText,
      confirmButtonLabel: strings.spotlightPrompt.startSpotlightConfirmButtonLabel,
      cancelButtonLabel: strings.spotlightPrompt.startSpotlightCancelButtonLabel,
      onConfirm: () => {
        onStartSpotlight();
        setIsPromptOpen(false);
      },
      onCancel: () => setIsPromptOpen(false)
    });
    setIsPromptOpen(true);
  };
};

/* @conditional-compile-remove(spotlight) */
const getStopLocalSpotlightWithPromptCallback = (
  onStopSpotlight: () => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): (() => Promise<void>) => {
  return async (): Promise<void> => {
    setPromptProps({
      heading: strings.spotlightPrompt.stopSpotlightOnSelfHeading,
      text: strings.spotlightPrompt.stopSpotlightOnSelfText,
      confirmButtonLabel: strings.spotlightPrompt.stopSpotlightOnSelfConfirmButtonLabel,
      cancelButtonLabel: strings.spotlightPrompt.stopSpotlightCancelButtonLabel,
      onConfirm: () => {
        onStopSpotlight();
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
export const useRemoteSpotlightCallbacksWithPrompt = (
  onStartRemoteSpotlight?: (userIds: string[]) => Promise<void>,
  onStopRemoteSpotlight?: (userIds: string[]) => Promise<void>,
  setIsPromptOpen?: (isOpen: boolean) => void,
  setPromptProps?: (promptProps: PromptProps) => void
): {
  onStartRemoteSpotlightWithPrompt?: (userIds: string[]) => Promise<void>;
  onStopRemoteSpotlightWithPrompt?: (userIds: string[]) => Promise<void>;
} => {
  const strings = useLocale().strings.call;

  return useMemo(() => {
    if (!setIsPromptOpen || !setPromptProps) {
      return {
        onStartRemoteSpotlightWithPrompt: onStartRemoteSpotlight,
        onStopRemoteSpotlightWithPrompt: onStopRemoteSpotlight
      };
    }
    return {
      onStartRemoteSpotlightWithPrompt: onStartRemoteSpotlight
        ? getStartRemoteSpotlightWithPromptCallback(onStartRemoteSpotlight, setIsPromptOpen, setPromptProps, strings)
        : undefined,
      onStopRemoteSpotlightWithPrompt: onStopRemoteSpotlight
        ? getStopRemoteSpotlightWithPromptCallback(onStopRemoteSpotlight, setIsPromptOpen, setPromptProps, strings)
        : undefined
    };
  }, [onStartRemoteSpotlight, onStopRemoteSpotlight, setIsPromptOpen, setPromptProps, strings]);
};

/* @conditional-compile-remove(spotlight) */
const getStartRemoteSpotlightWithPromptCallback = (
  onStartSpotlight: (userIds: string[]) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): ((userIds: string[]) => Promise<void>) => {
  return async (userIds: string[]): Promise<void> => {
    if (userIds.length > 1) {
      onStartSpotlight(userIds);
    }
    setPromptProps({
      heading: strings.spotlightPrompt.startSpotlightHeading,
      text: strings.spotlightPrompt.startSpotlightText,
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
const getStopRemoteSpotlightWithPromptCallback = (
  onStopSpotlight: (userIds: string[]) => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): ((userIds: string[]) => Promise<void>) => {
  return async (userIds: string[]): Promise<void> => {
    if (userIds.length > 1) {
      onStopSpotlight(userIds);
    }

    setPromptProps({
      heading: strings.spotlightPrompt.stopSpotlightHeading,
      text: strings.spotlightPrompt.stopSpotlightText,
      confirmButtonLabel: strings.spotlightPrompt.stopSpotlightConfirmButtonLabel,
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

/* @conditional-compile-remove(spotlight) */
/**
 * @internal
 */
export const useStopAllSpotlightCallbackWithPrompt = (
  stopAllSpotlight?: () => Promise<void>,
  setIsPromptOpen?: (isOpen: boolean) => void,
  setPromptProps?: (promptProps: PromptProps) => void
): {
  stopAllSpotlightWithPrompt?: (userIds?: string[]) => Promise<void>;
} => {
  const strings = useLocale().strings.call;

  return useMemo(() => {
    if (!setIsPromptOpen || !setPromptProps) {
      return {
        stopAllSpotlightWithPrompt: stopAllSpotlight
      };
    }
    return {
      stopAllSpotlightWithPrompt: stopAllSpotlight
        ? getStopAllSpotlightCallbackWithPromptCallback(stopAllSpotlight, setIsPromptOpen, setPromptProps, strings)
        : undefined
    };
  }, [stopAllSpotlight, setIsPromptOpen, setPromptProps, strings]);
};

/* @conditional-compile-remove(spotlight) */
const getStopAllSpotlightCallbackWithPromptCallback = (
  stopAllSpotlight: () => void,
  setIsPromptOpen: (isOpen: boolean) => void,
  setPromptProps: (promptProps: PromptProps) => void,
  strings: CallCompositeStrings
): (() => Promise<void>) => {
  return async (): Promise<void> => {
    setPromptProps({
      heading: strings.spotlightPrompt.stopAllSpotlightHeading,
      text: strings.spotlightPrompt.stopAllSpotlightText,
      confirmButtonLabel: strings.spotlightPrompt.stopSpotlightConfirmButtonLabel,
      cancelButtonLabel: strings.spotlightPrompt.stopSpotlightCancelButtonLabel,
      onConfirm: () => {
        stopAllSpotlight();
        setIsPromptOpen(false);
      },
      onCancel: () => setIsPromptOpen(false)
    });
    setIsPromptOpen(true);
  };
};

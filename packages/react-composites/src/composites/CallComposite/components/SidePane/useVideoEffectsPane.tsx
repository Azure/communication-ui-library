// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SidePaneRenderer, useIsParticularSidePaneOpen } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
/* @conditional-compile-remove(video-background-effects) */
import { useLocale } from '../../../localization';
import { VideoEffectsPaneContent } from '../../../common/VideoEffectsPane';
import { AdapterError } from '../../../common/adapters';
import { DismissedError, dismissVideoEffectsError } from '../../utils';
import { videoBackgroundErrorsSelector } from '../../selectors/videoBackgroundErrorsSelector';
import { useSelector } from '../../hooks/useSelector';

/** @private */
export const VIDEO_EFFECTS_SIDE_PANE_ID = 'videoeffects';

/** @private */
export const VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM = 17.5;

/** @private */
export const useVideoEffectsPane = (
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void,
  mobileView: boolean
): {
  openVideoEffectsPane: () => void;
  closeVideoEffectsPane: () => void;
  toggleVideoEffectsPane: () => void;
  isVideoEffectsPaneOpen: boolean;
} => {
  const closePane = useCallback(() => {
    updateSidePaneRenderer(undefined);
  }, [updateSidePaneRenderer]);

  /* @conditional-compile-remove(video-background-effects) */
  const locale = useLocale();

  const onRenderHeader = useCallback(() => {
    return (
      <SidePaneHeader
        onClose={closePane}
        /* @conditional-compile-remove(video-background-effects) */
        headingText={locale.strings.call.videoEffectsPaneTitle}
        /* @conditional-compile-remove(video-background-effects) */
        dismissSidePaneButtonAriaLabel={
          locale.strings.call.dismissSidePaneButtonLabel ??
          locale.strings.callWithChat.dismissSidePaneButtonLabel ??
          'Close'
        }
        mobileView={mobileView}
      />
    );
  }, [closePane, /* @conditional-compile-remove(video-background-effects) */ locale.strings, mobileView]);

  const [dismissedVideoEffectsError, setDismissedVideoEffectsError] = useState<DismissedError>();
  const [activeVideoEffect, setActiveVideoEffect] = useState<ActiveVideoEffect>();
  const onDismissVideoEffectError = useCallback((error: AdapterError) => {
    setDismissedVideoEffectsError(dismissVideoEffectsError(error));
  }, []);
  const latestVideoEffectError = useSelector(videoBackgroundErrorsSelector);
  const activeVideoEffectError = useCallback(() => {
    if (
      latestVideoEffectError &&
      (!dismissedVideoEffectsError || latestVideoEffectError.timestamp > dismissedVideoEffectsError.dismissedAt) &&
      (!activeVideoEffect || latestVideoEffectError.timestamp > activeVideoEffect.timestamp)
    ) {
      return latestVideoEffectError;
    }
    return undefined;
  }, [dismissedVideoEffectsError, latestVideoEffectError, activeVideoEffect]);

  const onRenderContent = useCallback((): JSX.Element => {
    return (
      <VideoEffectsPaneContent
        onDismissError={onDismissVideoEffectError}
        activeVideoEffectError={activeVideoEffectError}
        setActiveVideoEffect={setActiveVideoEffect}
      />
    );
  }, [onDismissVideoEffectError, activeVideoEffectError]);

  const sidePaneRenderer: SidePaneRenderer = useMemo(
    () => ({
      headerRenderer: onRenderHeader,
      contentRenderer: onRenderContent,
      id: VIDEO_EFFECTS_SIDE_PANE_ID
    }),
    [onRenderContent, onRenderHeader]
  );

  const openPane = useCallback(() => {
    updateSidePaneRenderer(sidePaneRenderer);
  }, [sidePaneRenderer, updateSidePaneRenderer]);

  const isOpen = useIsParticularSidePaneOpen(VIDEO_EFFECTS_SIDE_PANE_ID);

  // Update pane renderer if it is open and the openPane dep changes
  useEffect(() => {
    if (isOpen) {
      openPane();
    }
  }, [isOpen, openPane]);

  const togglePane = useCallback(() => {
    if (isOpen) {
      closePane();
    } else {
      openPane();
    }
  }, [closePane, isOpen, openPane]);

  return {
    openVideoEffectsPane: openPane,
    closeVideoEffectsPane: closePane,
    toggleVideoEffectsPane: togglePane,
    isVideoEffectsPaneOpen: isOpen
  };
};

/**
 * Active video effect with timestamp.
 *
 * @private
 */
export interface ActiveVideoEffect {
  /**
   * Type of video effect that is active.
   */
  type: 'blur' | 'replacement';
  /**
   * The latest timestamp when this effect was activated.
   *
   */
  timestamp: Date;
}

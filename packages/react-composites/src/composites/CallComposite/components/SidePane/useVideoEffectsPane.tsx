// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { createRef, useCallback, useEffect, useMemo } from 'react';
import { SidePaneRenderer, useIsParticularSidePaneOpen } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';

import { useLocale } from '../../../localization';
import { VideoEffectsPaneContent } from '../../../common/VideoEffectsPane';
import { ActiveErrorMessage } from '@internal/react-components';
import { IButton } from '@fluentui/react';

/** @private */
export const VIDEO_EFFECTS_SIDE_PANE_ID = 'videoeffects';

/** @private */
export const VIDEO_EFFECTS_SIDE_PANE_WIDTH_REM = 17.5;

/** @private */
export const useVideoEffectsPane = (
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void,
  mobileView: boolean,
  latestErrors: ActiveErrorMessage[],
  onDismissError: (error: ActiveErrorMessage) => void,
  cameraButtonRef?: React.RefObject<IButton>
): {
  openVideoEffectsPane: () => void;
  closeVideoEffectsPane: () => void;
  toggleVideoEffectsPane: () => void;
  isVideoEffectsPaneOpen: boolean;
} => {
  const closePane = useCallback(() => {
    updateSidePaneRenderer(undefined);
    cameraButtonRef?.current?.focus();
  }, [cameraButtonRef, updateSidePaneRenderer]);

  const locale = useLocale();

  const onRenderHeader = useCallback(() => {
    return (
      <SidePaneHeader
        onClose={closePane}
        headingText={locale.strings.call.videoEffectsPaneTitle}
        dismissSidePaneButtonAriaLabel={
          locale.strings.call.dismissSidePaneButtonLabel ??
          locale.strings.callWithChat.dismissSidePaneButtonLabel ??
          'Close'
        }
        mobileView={mobileView}
      />
    );
  }, [closePane, locale.strings, mobileView]);

  const latestVideoEffectError = latestErrors.find((error) => error.type === 'unableToStartVideoEffect');
  const updateFocusHandle = useMemo(() => createRef<{ focus: () => void }>(), []);

  const onRenderContent = useCallback((): JSX.Element => {
    return (
      <VideoEffectsPaneContent
        onDismissError={onDismissError}
        activeVideoEffectError={latestVideoEffectError}
        activeVideoEffectChange={() => {
          // Clear any existing video effects error when the user clicks on a new video effect

          latestVideoEffectError && onDismissError?.(latestVideoEffectError);
        }}
        updateFocusHandle={updateFocusHandle}
      />
    );
  }, [latestVideoEffectError, onDismissError, updateFocusHandle]);

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

    // Run in a setTimeout as it must be called only once the imperative handle is available
    setTimeout(() => updateFocusHandle.current?.focus(), 0);
  }, [sidePaneRenderer, updateSidePaneRenderer, updateFocusHandle]);

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

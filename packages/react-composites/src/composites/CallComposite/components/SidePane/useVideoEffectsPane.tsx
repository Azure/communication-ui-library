// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { useCloseSidePane, useOpenSidePane } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
/* @conditional-compile-remove(video-background-effects) */
import { useLocale } from '../../../localization';
import { VideoEffectsPaneContent } from '../../../common/VideoEffectsPane';

/** @private */
export const useVideoEffectsPane = (
  mobileView: boolean
): {
  openVideoEffectsPane: () => void;
  closeVideoEffectsPane: () => void;
  toggleVideoEffectsPane: () => void;
  isVideoEffectsPaneOpen: boolean;
} => {
  const { closePane } = useCloseSidePane();

  /* @conditional-compile-remove(video-background-effects) */
  const locale = useLocale();

  const onRenderHeader = useCallback(() => {
    return (
      <SidePaneHeader
        onClose={closePane}
        /* @conditional-compile-remove(video-background-effects) */
        headingText={locale.strings.call.effects ?? 'Effects'}
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

  const onRenderContent = useCallback((): JSX.Element => {
    return <VideoEffectsPaneContent />;
  }, []);

  const { isOpen, openPane } = useOpenSidePane('videoeffects', onRenderHeader, onRenderContent);

  const toggleVideoEffectsPane = useCallback(() => {
    if (isOpen) {
      closePane();
    } else {
      openPane();
    }
  }, [closePane, isOpen, openPane]);

  return {
    openVideoEffectsPane: openPane,
    closeVideoEffectsPane: closePane,
    toggleVideoEffectsPane,
    isVideoEffectsPaneOpen: isOpen
  };
};

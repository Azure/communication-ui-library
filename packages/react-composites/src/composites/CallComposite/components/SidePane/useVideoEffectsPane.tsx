// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { useCloseSidePane, useOpenSidePane } from './SidePaneProvider';
import { SidePaneHeader } from '../../../common/SidePaneHeader';
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

  const locale = useLocale();

  const onRenderHeader = useCallback(() => {
    return (
      <SidePaneHeader
        onClose={closePane}
        headingText={locale.strings.call.effects ?? 'Effects'}
        dismissSidePaneButtonAriaLabel={
          locale.strings.call.dismissSidePaneButtonLabel ??
          locale.strings.callWithChat.dismissSidePaneButtonLabel ??
          'Close'
        }
        mobileView={mobileView}
      />
    );
  }, [closePane, locale.strings, mobileView]);

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

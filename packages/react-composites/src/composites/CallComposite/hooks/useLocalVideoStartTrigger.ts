// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useEffect, useState } from 'react';
import { MediaGallery } from '../components/MediaGallery';
import { getIsPreviewCameraOn } from '../selectors/baseSelectors';
import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';

/**
 * @private
 *
 * `shouldTransition` is an extra predicate that controls whether this hooks actually transitions the call.
 * The rule of hooks disallows calling the hook conditionally, so this predicate can be used to make the decision.
 */
export const useLocalVideoStartTrigger = (isLocalVideoAvailable: boolean, shouldTransition?: boolean): void => {
  // Once a call is joined, we need to transition the local preview camera setting into the call.
  // This logic is needed on any screen that we might join a call from:
  // - The Media gallery
  // - The lobby page
  // - The networkReconnect interstitial that may show at the start of a call.
  //
  // @TODO: Can we simply have the callHandlers handle this transition logic.
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);
  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  useEffect(() => {
    if (shouldTransition !== false) {
      if (isPreviewCameraOn && !isLocalVideoAvailable && !isButtonStatusSynced) {
        mediaGalleryHandlers.onStartLocalVideo();
      }
      setIsButtonStatusSynced(true);
    }
  }, [shouldTransition, isButtonStatusSynced, isPreviewCameraOn, isLocalVideoAvailable, mediaGalleryHandlers]);
};

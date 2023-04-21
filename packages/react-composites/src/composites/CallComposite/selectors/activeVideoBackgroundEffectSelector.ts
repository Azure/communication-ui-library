// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(video-background-effects) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(video-background-effects) */
import { getSelectedVideoEffect } from './baseSelectors';
/* @conditional-compile-remove(video-background-effects) */
import { SelectedVideoBackgroundEffect } from '../adapter/CallAdapter';

/* @conditional-compile-remove(video-background-effects) */
/**
 * @private
 */
export const activeVideoBackgroundEffectSelector = reselect.createSelector(
  [getSelectedVideoEffect],
  (selectedVideoBackgroundEffect?: SelectedVideoBackgroundEffect) => {
    if (
      selectedVideoBackgroundEffect &&
      (selectedVideoBackgroundEffect.effectName === 'blur' || selectedVideoBackgroundEffect.effectName === 'none')
    ) {
      return selectedVideoBackgroundEffect.effectName;
    } else if (selectedVideoBackgroundEffect && selectedVideoBackgroundEffect.effectName === 'replacement') {
      return selectedVideoBackgroundEffect?.effectKey;
    }
    return 'none';
  }
);

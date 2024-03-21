// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as reselect from 'reselect';

import { getSelectedVideoEffect } from './baseSelectors';

import { VideoBackgroundEffect } from '../adapter/CallAdapter';

/**
 * @private
 */
export const activeVideoBackgroundEffectSelector = reselect.createSelector(
  [getSelectedVideoEffect],
  (selectedVideoBackgroundEffect?: VideoBackgroundEffect) => {
    if (
      selectedVideoBackgroundEffect &&
      (selectedVideoBackgroundEffect.effectName === 'blur' || selectedVideoBackgroundEffect.effectName === 'none')
    ) {
      return selectedVideoBackgroundEffect.effectName;
    } else if (selectedVideoBackgroundEffect && selectedVideoBackgroundEffect.effectName === 'replacement') {
      return selectedVideoBackgroundEffect?.key;
    }
    return 'none';
  }
);

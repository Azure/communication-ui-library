// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getSelectedVideoEffect } from './baseSelectors';
import { SelectedVideoBackgroundEffect } from '../adapter/CallAdapter';

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

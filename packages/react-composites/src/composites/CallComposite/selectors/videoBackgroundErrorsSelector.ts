// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(video-background-effects) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(video-background-effects) */
import { getLatestErrors } from './baseSelectors';
/* @conditional-compile-remove(video-background-effects) */
import { AdapterErrors } from '../../common/adapters';

/* @conditional-compile-remove(video-background-effects) */
/**
 * @private
 */
export const videoBackgroundErrorsSelector = reselect.createSelector([getLatestErrors], (errors?: AdapterErrors) => {
  if (errors && errors['VideoEffectsFeature.startEffects']) {
    return errors['VideoEffectsFeature.startEffects'];
  }
  return undefined;
});

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as reselect from 'reselect';
import { getLatestErrors } from './baseSelectors';
import { AdapterErrors } from '../../common/adapters';

/**
 * @private
 */
export const videoBackgroundErrorsSelector = reselect.createSelector([getLatestErrors], (errors?: AdapterErrors) => {
  if (errors && errors['VideoEffectsFeature.startEffects']) {
    return errors['VideoEffectsFeature.startEffects'];
  }
  return undefined;
});

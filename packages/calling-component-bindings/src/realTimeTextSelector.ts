// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import { CallClientState } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(rtt) */
import { CallingBaseSelectorProps, getRealTimeTextStatus } from './baseSelectors';
/* @conditional-compile-remove(rtt) */
import * as reselect from 'reselect';
/* @conditional-compile-remove(rtt) */
/**
 * Selector type for the {@link StartRealTimeTextButton} component.
 * @public
 */
export type StartRealTimeTextButtonSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  isRealTimeTextOn: boolean;
};
/* @conditional-compile-remove(rtt) */
/**
 * Selector for {@link StartRealTimeTextButton} component.
 *
 * @public
 */
export const startRealTimeTextButtonSelector: StartRealTimeTextButtonSelector = reselect.createSelector(
  [getRealTimeTextStatus],
  (isRealTimeTextFeatureActive) => {
    return {
      isRealTimeTextOn: isRealTimeTextFeatureActive ?? false
    };
  }
);

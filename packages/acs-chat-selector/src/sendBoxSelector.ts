// © Microsoft Corporation. All rights reserved.
import { createSelector } from 'reselect';
import { getCoolPeriod, getSelectorProps } from './baseSelectors';

export const sendBoxSelector = createSelector(
  [getCoolPeriod, getSelectorProps],
  (coolPeriod, { displayName, userId }) => ({
    displayName: displayName,
    userId: userId,
    disabled: coolPeriod ? coolPeriod.getTime() - Date.now() > 0 : false
  })
);

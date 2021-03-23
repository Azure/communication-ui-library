// © Microsoft Corporation. All rights reserved.
import { createSelector } from 'reselect';
import { getCoolPeriod, getSelectorProps } from './baseSelectors';

// The following need explicitly imported to avoid api-extractor issues.
// These can be removed once https://github.com/microsoft/rushstack/pull/1916 is fixed.
// @ts-ignore
import * as reselect from 'reselect';
// @ts-ignore
import { ChatClientState } from '@azure/acs-chat-declarative';
// @ts-ignore
import { BaseChatConfigProps } from './baseSelectors';

export const sendBoxSelector = createSelector(
  [getCoolPeriod, getSelectorProps],
  (coolPeriod, { displayName, userId }) => ({
    displayName: displayName,
    userId: userId,
    disabled: coolPeriod ? coolPeriod.getTime() - Date.now() > 0 : false
  })
);

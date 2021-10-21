// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState } from '@azure/communication-calling';
import { CallCompositePage } from '../../CallComposite';

/**
 * Page state the Meeting composite could be in.
 *
 * @alpha
 */
export type MeetingCompositePage =
  | 'configuration'
  | 'lobby'
  | 'meeting'
  | 'accessDeniedTeamsMeeting'
  | 'removedFromCall';

/**
 * @private
 */
export function callPageToMeetingPage(page: CallCompositePage): MeetingCompositePage {
  return page === 'call' ? 'meeting' : page;
}

/**
 * @private
 */
export function meetingPageToCallPage(page: MeetingCompositePage): CallCompositePage {
  return page === 'meeting' ? 'call' : page;
}

/**
 * @private
 */
export const hasJoinedCall = (page: MeetingCompositePage, callStatus: CallState): boolean =>
  page === 'meeting' && callStatus === 'Connected';

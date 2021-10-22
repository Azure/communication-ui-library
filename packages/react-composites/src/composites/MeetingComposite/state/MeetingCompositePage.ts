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
  | 'leftMeeting'
  | 'accessDeniedTeamsMeeting'
  | 'removedFromMeeting';

/**
 * @private
 */
export function callPageToMeetingPage(page: CallCompositePage): MeetingCompositePage {
  switch (page) {
    case 'call':
      return 'meeting';
    case 'leftCall':
      return 'leftMeeting';
    case 'removedFromCall':
      return 'removedFromMeeting';
    default:
      return page;
  }
}

/**
 * @private
 */
export function meetingPageToCallPage(page: MeetingCompositePage): CallCompositePage {
  switch (page) {
    case 'meeting':
      return 'call';
    case 'leftMeeting':
      return 'leftCall';
    case 'removedFromMeeting':
      return 'removedFromCall';
    default:
      return page;
  }
}

/**
 * @private
 */
export const hasJoinedCall = (page: MeetingCompositePage, callStatus: CallState): boolean =>
  page === 'meeting' && callStatus === 'Connected';

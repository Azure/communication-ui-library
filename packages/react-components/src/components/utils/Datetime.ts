// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageThreadStrings } from '../MessageThread';

/**
 * @private
 */
export const formatTimeForChatMessage = (messageDate: Date): string => {
  return messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

/**
 * @private
 */
export const formatDateForChatMessage = (messageDate: Date): string => {
  return messageDate.toLocaleDateString();
};

/**
 * Given a message date object in ISO8601 and a current date object, generates a user friendly timestamp text
 * using the system locale.
 * <time in locale format>.
 * Yesterday <time in locale format>.
 * <dateStrings day of week> <time in locale format>.
 * <date in locale format> <time in locale format>.
 *
 * If message is after yesterday, then only show the time.
 * If message is before yesterday and after day before yesterday, then show 'Yesterday' plus the time.
 * If message is before day before yesterday and within the current week, then show 'Monday/Tuesday/etc' plus the time.
 *   - We consider start of the week as Sunday. If current day is Sunday, then any time before that is in previous week.
 * If message is in previous or older weeks, then show date string plus the time.
 *
 * @param messageDate - date of message
 * @param currentDate - date used as offset to create the user friendly timestamp (e.g. to create 'Yesterday' instead of an absolute date)
 *
 * @private
 */
export const formatTimestampForChatMessage = (
  messageDate: Date,
  todayDate: Date,
  dateStrings: MessageThreadStrings
): string => {
  // If message was in the same day timestamp string is just the time like '1:30 p.m.'.
  const startOfDay = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  if (messageDate > startOfDay) {
    return formatTimeForChatMessage(messageDate);
  }

  // If message was yesterday then timestamp string is like this 'Yesterday 1:30 p.m.'.
  const yesterdayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  if (messageDate > yesterdayDate) {
    return dateStrings.yesterday + ' ' + formatTimeForChatMessage(messageDate);
  }

  // If message was before Sunday and today is Sunday (start of week) then timestamp string is like
  // '2021-01-10 1:30 p.m.'.
  const weekDay = todayDate.getDay();
  if (weekDay === 0) {
    return formatDateForChatMessage(messageDate) + ' ' + formatTimeForChatMessage(messageDate);
  }

  // If message was before first day of the week then timestamp string is like Monday 1:30 p.m.
  const firstDayOfTheWeekDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - weekDay);
  if (messageDate > firstDayOfTheWeekDate) {
    return dayToDayName(messageDate.getDay(), dateStrings) + ' ' + formatTimeForChatMessage(messageDate);
  }

  // If message date is in previous or older weeks then timestamp string is like 2021-01-10 1:30 p.m.
  return formatDateForChatMessage(messageDate) + ' ' + formatTimeForChatMessage(messageDate);
};

const dayToDayName = (day: number, dateStrings: MessageThreadStrings): string => {
  switch (day) {
    case 0:
      return dateStrings.sunday;
    case 1:
      return dateStrings.monday;
    case 2:
      return dateStrings.tuesday;
    case 3:
      return dateStrings.wednesday;
    case 4:
      return dateStrings.thursday;
    case 5:
      return dateStrings.friday;
    case 6:
      return dateStrings.saturday;
    default:
      throw new Error(`Invalid day [${day}] passed`);
  }
};

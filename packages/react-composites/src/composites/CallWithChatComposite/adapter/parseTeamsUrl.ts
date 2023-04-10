// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @private
 */
const unsupportedThreadType = ['@thread.tacv2', '@thread.skype'];

/**
 * @private
 */
const TEAMS_LIMITATION_LEARN_MORE =
  'https://learn.microsoft.com/en-us/azure/communication-services/concepts/join-teams-meeting#limitations-and-known-issues';

/**
 * Get chat thread from a teams url.
 * As per documented on the Chat SDK: https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/chat/meeting-interop?pivots=platform-web#get-a-teams-meeting-chat-thread-for-a-communication-services-user
 *
 * @private
 */
export const getChatThreadFromTeamsLink = (teamsMeetingLink: string): string => {
  // Get the threadId from the url - this also contains the call locator ID that will be removed in the threadId.split
  let threadId = teamsMeetingLink.replace('https://teams.microsoft.com/l/meetup-join/', '');
  // Unescape characters that applications like Outlook encode when creating joinable links
  threadId = decodeURIComponent(threadId);
  // Extract just the chat guid from the link, stripping away the call locator ID
  threadId = threadId.split(/^(.*?@thread\.v2)/gm)[1];
  if (!threadId || threadId.length === 0) {
    if (unsupportedThreadType.some((t) => teamsMeetingLink.includes(t))) {
      throw new Error(`Teams Channel Meetings are not currently supported, read more ${TEAMS_LIMITATION_LEARN_MORE}`);
    }
    throw new Error('Could not get chat thread from teams link');
  }

  return threadId;
};

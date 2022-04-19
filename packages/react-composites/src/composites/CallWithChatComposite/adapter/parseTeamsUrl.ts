// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

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
    throw new Error('Could not get chat thread from teams link');
  }

  return threadId;
};

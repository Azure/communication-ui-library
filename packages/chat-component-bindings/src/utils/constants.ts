// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS = 8000;
export const PARTICIPANTS_THRESHOLD = 20;

export const ACSKnownMessageType = {
  text: 'text' as 'text',
  html: 'html' as 'html',
  richtextHtml: 'richtext/html' as 'richtext/html',
  topicUpdated: 'topicUpdated' as 'topicUpdated',
  participantAdded: 'participantAdded' as 'participantAdded',
  participantRemoved: 'participantRemoved' as 'participantRemoved'
};

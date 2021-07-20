// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS = 8000;
export const PARTICIPANTS_THRESHOLD = 20;

export const ACSKnownMessageType = {
  text: 'text' as const,
  html: 'html' as const,
  richtextHtml: 'richtext/html' as const,
  topicUpdated: 'topicUpdated' as const,
  participantAdded: 'participantAdded' as const,
  participantRemoved: 'participantRemoved' as const
};

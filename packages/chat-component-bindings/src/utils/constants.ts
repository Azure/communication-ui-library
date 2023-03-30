// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @private
 */
export const MINIMUM_TYPING_INTERVAL_IN_MILLISECONDS = 8000;

/**
 * @private
 */
export const PARTICIPANTS_THRESHOLD = 20;

/**
 * @private
 */
export const MINUTE_IN_MS = 1000 * 60;

/**
 * @private
 */
export const DEFAULT_DATA_LOSS_PREVENTION_POLICY_URL = 'https://go.microsoft.com/fwlink/?LinkId=2132837';

/**
 * @private
 *
 * TODO: Import enum from @azure/communication-chat when ChatMessageType shows up in new release version
 * (or define our type to decouple)
 */
export const ACSKnownMessageType = {
  text: 'text' as const,
  html: 'html' as const,
  richtextHtml: 'richtext/html' as const,
  topicUpdated: 'topicUpdated' as const,
  participantAdded: 'participantAdded' as const,
  participantRemoved: 'participantRemoved' as const
};

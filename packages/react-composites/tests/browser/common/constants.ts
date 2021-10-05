// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// This file is pulled in to the browser at the browser uses IDS.
// Quickly check if process is available to prevent browser throwing an error.
const nodeEnv = typeof process !== 'undefined';
if (nodeEnv && !process.env.CONNECTION_STRING) {
  throw new Error('No CONNECTION_STRING set in environment variable.');
}
export const CONNECTION_STRING: string = nodeEnv && process.env.CONNECTION_STRING ? process.env.CONNECTION_STRING : '';

export const CHAT_TOPIC_NAME = 'Cowabunga';

export const TEST_PARTICIPANTS = ['Dorian Gutmann', 'Kathleen Carroll'];

export const IDS = {
  sendboxTextfield: 'sendbox-textfield',
  participantList: 'participant-list',
  messageContent: 'message-content',
  messageTimestamp: 'message-timestamp',
  typingIndicator: 'typing-indicator',
  videoGallery: 'video-gallery',
  videoTile: 'video-tile'
};

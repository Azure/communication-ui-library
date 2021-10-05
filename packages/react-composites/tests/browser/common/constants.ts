// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

if (!process.env.CONNECTION_STRING) {
  throw 'No CONNECTION_STRING set in environment variable.';
}

export const CONNECTION_STRING: string = process.env.CONNECTION_STRING;

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

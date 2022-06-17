// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-signaling';
import { Stack } from '@fluentui/react';
import { MessageProps } from '@internal/react-components';
import React from 'react';
import { AvatarPersonaData } from '../../../../src';

/**
 * Custom onRenderTypingIndicator prop of {@link ChatComposite} used for UI test
 */
export const customOnRenderTypingIndicator = (typingUsers: ChatParticipant[]): JSX.Element => (
  <Stack style={{ width: '100%' }}>
    <text id="custom-data-model-typing-indicator">
      {typingUsers.length > 0
        ? `${typingUsers.map((user) => user.displayName).join(',')} is typing...`.toUpperCase()
        : 'No one is currently typing.'}
    </text>
  </Stack>
);

/**
 * Custom onRenderMessage prop of {@link ChatComposite} used for UI test
 */
export const customOnRenderMessage = (messageProps: MessageProps): JSX.Element => (
  <text
    data-ui-status={messageProps.message.messageType === 'chat' ? messageProps.message.status : ''}
    id="custom-data-model-message"
  >
    {getMessageContentInUppercase(messageProps)}
  </text>
);

const getMessageContentInUppercase = (messageProps: MessageProps): string => {
  const message = messageProps.message;
  switch (message.messageType) {
    case 'chat':
    case 'custom':
      return message.content.toUpperCase();
    case 'system':
      switch (message.systemMessageType) {
        case 'content':
          return message.content.toUpperCase();
        case 'topicUpdated':
          return message.topic.toUpperCase();
        case 'participantAdded':
          return `Participants Added: ${message.participants.map((p) => p.displayName).join(',')}`.toUpperCase();
        case 'participantRemoved':
          return `Participants Removed: ${message.participants.map((p) => p.displayName).join(',')}`.toUpperCase();
        default:
          return 'CUSTOM MESSAGE';
      }
    default:
      'CUSTOM MESSAGE';
  }
};

/**
 * Custom onFetchAvatarPersonaData prop of {@link ChatComposite} used for UI test
 */
export const customOnFetchAvatarPersonaData = (): Promise<AvatarPersonaData> =>
  new Promise((resolve) =>
    resolve({
      imageInitials: 'CI',
      text: 'Custom Name'
    })
  );

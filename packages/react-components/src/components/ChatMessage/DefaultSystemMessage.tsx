// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _formatString } from '@internal/acs-ui-common';
import React from 'react';
import { MessageProps, MessageRenderer, _ChatMessageProps } from '../MessageThread';
import {
  CommunicationParticipant,
  ComponentSlotStyle,
  ParticipantAddedSystemMessage,
  ParticipantRemovedSystemMessage
} from '../../types';
import { SystemMessage as SystemMessageComponent, SystemMessageIconTypes } from './../SystemMessage';
import { useLocale } from '../../localization/LocalizationProvider';

/**
 * @private
 */
export const DefaultSystemMessage: MessageRenderer = (props: MessageProps) => {
  const message = props.message;
  switch (message.messageType) {
    case 'system':
      switch (message.systemMessageType) {
        case 'content':
          return (
            <SystemMessageComponent
              iconName={(message.iconName ? message.iconName : '') as SystemMessageIconTypes}
              content={message.content ?? ''}
              containerStyle={props?.messageContainerStyle}
            />
          );
        case 'participantAdded':
        case 'participantRemoved':
          return (
            <ParticipantSystemMessageComponent
              message={message}
              style={props.messageContainerStyle}
              defaultName={props.strings.noDisplayNameSub}
            />
          );
      }
  }
  return <></>;
};

const ParticipantSystemMessageComponent = ({
  message,
  style,
  defaultName
}: {
  message: ParticipantAddedSystemMessage | ParticipantRemovedSystemMessage;
  style?: ComponentSlotStyle;
  defaultName: string;
}): JSX.Element => {
  const { strings } = useLocale();
  const participantsStr = generateParticipantsStr(message.participants, defaultName);
  const messageSuffix =
    message.systemMessageType === 'participantAdded'
      ? strings.messageThread.participantJoined
      : strings.messageThread.participantLeft;

  if (participantsStr !== '') {
    return (
      <SystemMessageComponent
        iconName={(message.iconName ? message.iconName : '') as SystemMessageIconTypes}
        content={`${participantsStr} ${messageSuffix}`}
        containerStyle={style}
      />
    );
  }
  return <></>;
};

const generateParticipantsStr = (participants: CommunicationParticipant[], defaultName: string): string =>
  participants
    .map(
      (participant) =>
        `${!participant.displayName || participant.displayName === '' ? defaultName : participant.displayName}`
    )
    .join(', ');

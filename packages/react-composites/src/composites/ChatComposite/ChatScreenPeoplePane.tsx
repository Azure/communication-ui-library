// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ParticipantList, ParticipantMenuItemsCallback } from '@internal/react-components';
import React from 'react';
import { AvatarPersonaDataCallback } from '..';
import { ParticipantContainer } from '../common/ParticipantContainer';
import { useLocale } from '../localization';
import { usePropsFor } from './hooks/usePropsFor';

export type ChatScreenPeopelPaneProps = {
  onFetchAvatarPersonaData: AvatarPersonaDataCallback | undefined;
  onFetchParticipantMenuItems: ParticipantMenuItemsCallback | undefined;
};

export const ChatScreenPeoplePane = (props: ChatScreenPeopelPaneProps): JSX.Element => {
  const { onFetchAvatarPersonaData, onFetchParticipantMenuItems } = props;
  const locale = useLocale();
  const chatListHeader = locale.strings.chat.chatListHeader;
  const participantListProps = usePropsFor(ParticipantList);

  return (
    <ParticipantContainer
      participantListProps={participantListProps}
      title={chatListHeader}
      onFetchAvatarPersonaData={onFetchAvatarPersonaData}
      onFetchParticipantMenuItems={onFetchParticipantMenuItems}
    />
  );
};

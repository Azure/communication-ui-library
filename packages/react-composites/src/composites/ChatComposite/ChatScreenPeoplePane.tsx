// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ParticipantList, ParticipantMenuItemsCallback } from '@internal/react-components';
import React from 'react';
import { AvatarPersonaDataCallback } from '..';
import { ParticipantContainer } from '../common/ParticipantContainer';
import { useLocale } from '../localization';
import { usePropsFor } from './hooks/usePropsFor';

/**
 * Props for the chat screen people pane
 * @private
 */
type ChatScreenPeoplePaneProps = {
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  isMobile?: boolean;
};

/**
 * @private
 */
export const ChatScreenPeoplePane = (props: ChatScreenPeoplePaneProps): JSX.Element => {
  const { onFetchAvatarPersonaData, onFetchParticipantMenuItems, isMobile } = props;
  const locale = useLocale();
  const chatListHeader = locale.strings.chat.chatListHeader;
  const participantListProps = usePropsFor(ParticipantList);

  return (
    <ParticipantContainer
      participantListProps={participantListProps}
      title={chatListHeader}
      onFetchAvatarPersonaData={onFetchAvatarPersonaData}
      onFetchParticipantMenuItems={onFetchParticipantMenuItems}
      isMobile={isMobile}
    />
  );
};

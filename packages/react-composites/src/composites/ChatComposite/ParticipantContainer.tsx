// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { participantListStack, participantListStyle, participantListWrapper, listHeader } from './styles/Chat.styles';
import { OnRenderAvatarCallback, ParticipantList, ParticipantMenuItemsCallback } from '@internal/react-components';
import { FocusZone, Stack } from '@fluentui/react';
import { useLocale } from '../localization';
import { usePropsFor } from './hooks/usePropsFor';
import { AvatarPersona, AvatarPersonaDataCallback } from '../common/AvatarPersona';

type ParticipantContainerProps = {
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
};

/**
 * @private
 */
export const ParticipantContainer = (props: ParticipantContainerProps): JSX.Element => {
  const { onFetchAvatarPersonaData, onFetchParticipantMenuItems } = props;
  const participantListProps = usePropsFor(ParticipantList);
  const locale = useLocale();
  const chatListHeader = locale.strings.chat.chatListHeader;
  return (
    <Stack className={participantListWrapper}>
      <Stack className={participantListStack}>
        <Stack.Item className={listHeader}>{chatListHeader}</Stack.Item>
        <FocusZone className={participantListStyle}>
          <ParticipantList
            {...participantListProps}
            onRenderAvatar={(userId, options) => (
              <AvatarPersona
                data-ui-id="chat-composite-participant-custom-avatar"
                userId={userId}
                {...options}
                dataProvider={onFetchAvatarPersonaData}
              />
            )}
            onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          />
        </FocusZone>
      </Stack>
    </Stack>
  );
};

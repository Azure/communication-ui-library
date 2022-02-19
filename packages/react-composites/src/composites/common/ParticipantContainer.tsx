// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import {
  participantListStack,
  participantListStyle,
  participantListWrapper,
  listHeader
} from './styles/ParticipantContainer.styles';
import {
  OnRenderAvatarCallback,
  ParticipantList,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  ParticipantListParticipant
} from '@internal/react-components';
import { concatStyleSets, FocusZone, Stack, useTheme } from '@fluentui/react';
import { AvatarPersona, AvatarPersonaDataCallback } from './AvatarPersona';
import { peopleSubheadingStyle } from './styles/ParticipantContainer.styles';

type ParticipantContainerProps = {
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  participantListProps: ParticipantListProps;
  title?: string;
};

/**
 * @private
 */
export const ParticipantContainer = (props: ParticipantContainerProps): JSX.Element => {
  return (
    <Stack className={participantListWrapper}>
      <ParticipantListWithHeading {...props} />
    </Stack>
  );
};

/**
 * @private
 */
export const ParticipantListWithHeading = (props: {
  participantListProps: ParticipantListProps;
  title?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onParticipantClick?: (props?: ParticipantListParticipant) => void;
}): JSX.Element => {
  const { onFetchAvatarPersonaData, onFetchParticipantMenuItems, title, participantListProps } = props;
  const theme = useTheme();
  const subheadingStyleThemed = concatStyleSets(peopleSubheadingStyle, {
    root: {
      color: theme.palette.neutralSecondary
    }
  });

  return (
    <Stack className={participantListStack}>
      <Stack.Item styles={subheadingStyleThemed} className={listHeader}>
        {title}
      </Stack.Item>
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
          onParticipantClick={props.onParticipantClick}
        />
      </FocusZone>
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import {
  participantListStack,
  participantListStyle,
  participantListMobileStyle,
  participantListWrapper,
  participantListDesktopStyle
} from './styles/ParticipantContainer.styles';
import {
  OnRenderAvatarCallback,
  ParticipantList,
  ParticipantListProps,
  ParticipantMenuItemsCallback
} from '@internal/react-components';
import { FocusZone, Stack, useTheme } from '@fluentui/react';
import { AvatarPersona, AvatarPersonaDataCallback } from './AvatarPersona';

type ParticipantContainerProps = {
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  participantListProps: ParticipantListProps;
  title?: string;
  isMobile?: boolean;
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
  isMobile?: boolean;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
}): JSX.Element => {
  const { onFetchAvatarPersonaData, onFetchParticipantMenuItems, title, participantListProps } = props;
  const theme = useTheme();
  const subheadingStyleThemed = useMemo(
    () => ({
      root: {
        color: theme.palette.neutralSecondary,
        fontSize: theme.fonts.smallPlus.fontSize,
        margin: props.isMobile ? '1rem' : '0.5rem'
      }
    }),
    [theme.palette.neutralSecondary, theme.fonts.smallPlus.fontSize]
  );

  return (
    <Stack className={participantListStack}>
      <Stack.Item styles={subheadingStyleThemed}>{title}</Stack.Item>
      <FocusZone className={participantListStyle}>
        <ParticipantList
          {...participantListProps}
          styles={props.isMobile ? participantListMobileStyle : participantListDesktopStyle}
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
  );
};

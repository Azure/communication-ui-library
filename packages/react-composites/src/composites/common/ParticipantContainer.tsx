// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useCallback, useMemo } from 'react';
import {
  participantListContainerStyle,
  participantListMobileStyle,
  participantListStack,
  participantListStyle,
  participantListWrapper
} from './styles/ParticipantContainer.styles';
import {
  OnRenderAvatarCallback,
  ParticipantList,
  ParticipantListProps,
  ParticipantMenuItemsCallback
} from '@internal/react-components';
import { FocusZone, Stack, useTheme } from '@fluentui/react';
import { AvatarPersona, AvatarPersonaDataCallback } from './AvatarPersona';
import { CustomAvatarOptions } from '@internal/react-components';
import { GraphPersona } from './GraphPersona';
import { _useIsSignedIn } from '@internal/acs-ui-common';
import { PersonViewType } from '@microsoft/mgt-react';

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
        margin: props.isMobile ? '0.5rem 1rem' : '0.5rem',
        fontSize: theme.fonts.smallPlus.fontSize
      }
    }),
    [theme.palette.neutralSecondary, theme.fonts.smallPlus.fontSize, props.isMobile]
  );

  const [isSignedIn] = _useIsSignedIn();

  const onRenderAvatar = useCallback(
    (userId: string, options: CustomAvatarOptions): JSX.Element => {
      console.log('userId: ', userId);
      const avatar = isSignedIn ? (
        <GraphPersona personQuery={`/users/${userId}/people`} view={PersonViewType.oneline} avatarSize="small" />
      ) : (
        <AvatarPersona
          data-ui-id="chat-composite-participant-custom-avatar"
          userId={userId}
          {...options}
          dataProvider={onFetchAvatarPersonaData}
        />
      );

      return avatar;
    },
    [isSignedIn, onFetchAvatarPersonaData]
  );

  return (
    <Stack className={participantListStack}>
      <Stack.Item styles={subheadingStyleThemed}>{title}</Stack.Item>
      <FocusZone className={participantListContainerStyle}>
        <ParticipantList
          {...participantListProps}
          styles={props.isMobile ? participantListMobileStyle : participantListStyle}
          onRenderAvatar={onRenderAvatar}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
        />
      </FocusZone>
    </Stack>
  );
};

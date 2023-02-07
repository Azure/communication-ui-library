// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useCallback, useMemo } from 'react';
import {
  participantListContainerStyle,
  participantListMobileStyle,
  participantListStack,
  participantListStyle,
  participantListWrapper,
  displayNameStyles
} from './styles/ParticipantContainer.styles';
import {
  OnRenderAvatarCallback,
  ParticipantList,
  ParticipantListProps,
  ParticipantMenuItemsCallback
} from '@internal/react-components';
import { FocusZone, Stack, Text, useTheme } from '@fluentui/react';
import { AvatarPersona, AvatarPersonaDataCallback } from './AvatarPersona';
import { OnFetchProfileCallback } from './Profile';
import { DisplayName } from './DisplayName';

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
  const theme = useTheme();
  const participantListWrapperClassName = useMemo(() => participantListWrapper(theme), [theme]);
  return (
    <Stack className={participantListWrapperClassName}>
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
  onFetchProfile?: OnFetchProfileCallback;
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

  const onRenderDisplayName = useCallback(
    (userId: string, displayName: string) => {
      return <DisplayName userId={userId} displayName={displayName} onFetchProfile={props.onFetchProfile} />;
    },
    [props.onFetchProfile]
  );

  return (
    <Stack className={participantListStack}>
      <Stack.Item styles={subheadingStyleThemed}>{title}</Stack.Item>
      <FocusZone className={participantListContainerStyle} shouldFocusOnMount={true}>
        <ParticipantList
          {...participantListProps}
          styles={props.isMobile ? participantListMobileStyle : participantListStyle}
          onRenderAvatar={(userId, options) => (
            <>
              <AvatarPersona
                onFetchProfile={props.onFetchProfile}
                data-ui-id="chat-composite-participant-custom-avatar"
                userId={userId}
                {...options}
                {...{ hidePersonaDetails: !!options?.text }}
                dataProvider={onFetchAvatarPersonaData}
              />
              {options?.text && (
                <Text nowrap={true} styles={displayNameStyles}>
                  {onRenderDisplayName ? onRenderDisplayName(userId ?? '', options?.text) : options?.text}
                </Text>
              )}
            </>
          )}
          onRenderDisplayName={onRenderDisplayName}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          showParticipantOverflowTooltip={!props.isMobile}
        />
      </FocusZone>
    </Stack>
  );
};

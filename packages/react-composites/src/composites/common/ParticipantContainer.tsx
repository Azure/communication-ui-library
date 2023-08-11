// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
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
import { useId } from '@fluentui/react-hooks';
import { _formatString } from '@internal/acs-ui-common';

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
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
}): JSX.Element => {
  const { onFetchAvatarPersonaData, onFetchParticipantMenuItems, title, participantListProps } = props;
  const subheadingUniqueId = useId();
  const theme = useTheme();
  /* @conditional-compile-remove(total-participant-count) */
  const totalParticipantCount = participantListProps.totalParticipantCount;
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

  return (
    <Stack className={participantListStack}>
      <Stack.Item styles={subheadingStyleThemed} aria-label={title} id={subheadingUniqueId}>
        {paneTitleTrampoline(
          title ?? '',
          /* @conditional-compile-remove(total-participant-count) */ totalParticipantCount
        )}
      </Stack.Item>
      <FocusZone className={participantListContainerStyle} shouldFocusOnMount={true}>
        <ParticipantList
          {...participantListProps}
          styles={props.isMobile ? participantListMobileStyle : participantListStyle}
          onRenderAvatar={(userId, options) => (
            <>
              <AvatarPersona
                data-ui-id="chat-composite-participant-custom-avatar"
                userId={userId}
                {...options}
                {...{ hidePersonaDetails: !!options?.text }}
                dataProvider={onFetchAvatarPersonaData}
              />
              {options?.text && (
                <Text nowrap={true} styles={displayNameStyles}>
                  {options?.text}
                </Text>
              )}
            </>
          )}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          showParticipantOverflowTooltip={!props.isMobile}
          participantAriaLabelledBy={subheadingUniqueId}
        />
      </FocusZone>
    </Stack>
  );
};

const paneTitleTrampoline = (paneTitle: string, totalParticipantCount?: number): string => {
  /* @conditional-compile-remove(total-participant-count) */
  const participantCountString = totalParticipantCount
    ? { numberOfPeople: `(${totalParticipantCount})` }
    : { numberOfPeople: ' ' };
  /* @conditional-compile-remove(total-participant-count) */
  return _formatString(paneTitle, participantCountString);
  return paneTitle;
};

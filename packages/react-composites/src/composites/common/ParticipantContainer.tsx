// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import {
  participantListContainerStyle,
  participantListMobileStyle,
  participantListStack,
  participantListStyle,
  participantListWrapper,
  displayNameStyles
} from './styles/ParticipantContainer.styles';
/* @conditional-compile-remove(spotlight) */
import { headingMoreButtonStyles } from './styles/ParticipantContainer.styles';
import { ParticipantList, ParticipantListProps, ParticipantMenuItemsCallback } from '@internal/react-components';
import { FocusZone, Stack, Text, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(spotlight) */
import { DefaultButton, IContextualMenuProps } from '@fluentui/react';
import { AvatarPersona, AvatarPersonaDataCallback } from './AvatarPersona';
import { useId } from '@fluentui/react-hooks';
import { _formatString } from '@internal/acs-ui-common';

type ParticipantContainerProps = {
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
  /* @conditional-compile-remove(spotlight) */
  headingMoreButtonAriaLabel?: string;
  /* @conditional-compile-remove(spotlight) */
  onClickHeadingMoreButton?: () => void;
  /* @conditional-compile-remove(spotlight) */
  headingMoreButtonMenuProps?: IContextualMenuProps;
  pinnedParticipants?: string[];
}): JSX.Element => {
  const {
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    title,
    participantListProps,
    /* @conditional-compile-remove(spotlight) */ headingMoreButtonAriaLabel,
    /* @conditional-compile-remove(spotlight) */ onClickHeadingMoreButton,
    /* @conditional-compile-remove(spotlight) */ headingMoreButtonMenuProps,
    pinnedParticipants
  } = props;
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
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack.Item grow styles={subheadingStyleThemed} aria-label={title} id={subheadingUniqueId}>
          {paneTitleTrampoline(
            title ?? '',
            /* @conditional-compile-remove(total-participant-count) */ totalParticipantCount
          )}
        </Stack.Item>
        {
          /* @conditional-compile-remove(spotlight) */ (onClickHeadingMoreButton ||
            (headingMoreButtonMenuProps?.items && headingMoreButtonMenuProps.items.length > 0)) && (
            <Stack.Item>
              <DefaultButton
                ariaLabel={headingMoreButtonAriaLabel}
                styles={headingMoreButtonStyles(theme)}
                iconProps={{ iconName: 'PeoplePaneMoreButton' }}
                onClick={onClickHeadingMoreButton ? () => onClickHeadingMoreButton() : undefined}
                menuProps={props.onClickHeadingMoreButton ? undefined : props.headingMoreButtonMenuProps}
                onRenderMenuIcon={() => null}
              />
            </Stack.Item>
          )
        }
      </Stack>
      <FocusZone className={participantListContainerStyle} shouldFocusOnMount={true}>
        <ParticipantList
          {...participantListProps}
          pinnedParticipants={pinnedParticipants}
          styles={props.isMobile ? participantListMobileStyle : participantListStyle}
          onRenderAvatar={(userId, options) => (
            <>
              <AvatarPersona
                data-ui-id="chat-composite-participant-custom-avatar"
                userId={userId}
                {...options}
                {...{ hidePersonaDetails: !!options?.text }}
                dataProvider={onFetchAvatarPersonaData}
                allowActiveBorder={true}
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
  const participantCountString = totalParticipantCount
    ? { numberOfPeople: `(${totalParticipantCount})` }
    : { numberOfPeople: ' ' };
  return _formatString(paneTitle, participantCountString);
};

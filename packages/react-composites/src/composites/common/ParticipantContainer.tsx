// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import {
  participantListContainerStyle,
  participantListMobileStyle,
  participantListStack,
  participantListStyle,
  participantListWrapper,
  displayNameStyles,
  headingMoreButtonStyles
} from './styles/ParticipantContainer.styles';
import { ParticipantList, ParticipantListProps, ParticipantMenuItemsCallback } from '@internal/react-components';
import { FocusZone, Stack, Text, TooltipHost, TooltipOverflowMode, getId, useTheme } from '@fluentui/react';
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
  headingMoreButtonAriaLabel?: string;
  onClickHeadingMoreButton?: () => void;
  headingMoreButtonMenuProps?: IContextualMenuProps;
  pinnedParticipants?: string[];
}): JSX.Element => {
  const {
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    title,
    participantListProps,
    headingMoreButtonAriaLabel,
    onClickHeadingMoreButton,
    headingMoreButtonMenuProps,
    pinnedParticipants
  } = props;
  const subheadingUniqueId = useId();
  const theme = useTheme();
  /* @conditional-compile-remove(total-participant-count) */
  const totalParticipantCount = participantListProps.totalParticipantCount;
  const tooltipId: string = getId('text-tooltip');
  const subheadingStyleThemed = useMemo(
    () => ({
      root: {
        h2: {
          color: theme.palette.neutralSecondary,
          margin: props.isMobile ? '0.5rem 1rem' : '0.5rem',
          fontSize: theme.fonts.smallPlus.fontSize,
          fontWeight: 'normal'
        }
      }
    }),
    [theme.palette.neutralSecondary, theme.fonts.smallPlus.fontSize, props.isMobile]
  );

  return (
    <Stack className={participantListStack}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack.Item grow styles={subheadingStyleThemed} aria-label={title} id={subheadingUniqueId}>
          <h2>
            {paneTitleTrampoline(
              title ?? '',
              /* @conditional-compile-remove(total-participant-count) */ totalParticipantCount
            )}
          </h2>
        </Stack.Item>
        {(onClickHeadingMoreButton ||
          (headingMoreButtonMenuProps?.items && headingMoreButtonMenuProps.items.length > 0)) && (
          <Stack.Item>
            <DefaultButton
              data-ui-id="people-pane-header-more-button"
              ariaLabel={headingMoreButtonAriaLabel}
              styles={headingMoreButtonStyles(theme)}
              iconProps={{ iconName: 'PeoplePaneMoreButton' }}
              onClick={onClickHeadingMoreButton ? () => onClickHeadingMoreButton() : undefined}
              menuProps={props.onClickHeadingMoreButton ? undefined : props.headingMoreButtonMenuProps}
              onRenderMenuIcon={() => null}
            />
          </Stack.Item>
        )}
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
                <div style={displayNameStyles}>
                  <TooltipHost content={options?.text} id={tooltipId} overflowMode={TooltipOverflowMode.Parent}>
                    <Text nowrap={false} aria-labelledby={tooltipId}>
                      {options?.text}
                    </Text>
                  </TooltipHost>
                </div>
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

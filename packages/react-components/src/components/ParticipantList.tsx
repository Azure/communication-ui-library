// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Icon,
  IContextualMenuItem,
  IContextualMenuItemStyles,
  merge,
  mergeStyles,
  PersonaPresence,
  Stack
} from '@fluentui/react';
import React, { useMemo } from 'react';
import { useIdentifiers } from '../identifiers';
import { useLocale } from '../localization';
import {
  BaseCustomStyles,
  CallParticipantListParticipant,
  OnRenderAvatarCallback,
  ParticipantListParticipant
} from '../types';
import { ParticipantItem, ParticipantItemStrings, ParticipantItemStyles } from './ParticipantItem';
import { iconStyles, participantListItemStyle, participantListStyle } from './styles/ParticipantList.styles';

/**
 * Styles for the {@link ParticipantList} {@link ParticipantItem}.
 *
 * @public
 */
export interface ParticipantListItemStyles extends ParticipantItemStyles {
  /** Styles applied to the sub-menu of the {@link ParticipantList} {@link ParticipantItem}. */
  participantSubMenuItemsStyles?: IContextualMenuItemStyles;
}

/**
 * Styles for the {@link ParticipantList}.
 *
 * @public
 */
export interface ParticipantListStyles extends BaseCustomStyles {
  /** Styles for the {@link ParticipantList} {@link ParticipantItem}. */
  participantItemStyles?: ParticipantListItemStyles;
}

/**
 * A callback for providing custom menu items for each participant in {@link ParticipantList}.
 *
 * @public
 */
export type ParticipantMenuItemsCallback = (
  participantUserId: string,
  userId?: string,
  defaultMenuItems?: IContextualMenuItem[]
) => IContextualMenuItem[];

/**
 * Props for {@link ParticipantList}.
 *
 * @public
 */
export type ParticipantListProps = {
  /** Participants in user call or chat */
  participants: ParticipantListParticipant[];
  /** User ID of user */
  myUserId?: string;
  /**
   * If set to `true`, excludes the local participant from the participant list with use of `myUserId` props (required in this case).
   *
   * @defaultValue `false`
   */
  excludeMe?: boolean;
  /** Optional callback to render each participant. If no callback is provided, each participant will be rendered with `ParticipantItem`  */
  onRenderParticipant?: (participant: ParticipantListParticipant) => JSX.Element | null;
  /** Optional callback to render the avatar for each participant. This property will have no effect if `onRenderParticipant` is assigned.  */
  onRenderAvatar?: OnRenderAvatarCallback;
  /** Optional callback to render the context menu for each participant  */
  onRemoveParticipant?: (userId: string) => void;
  /** Optional callback to render custom menu items for each participant. */
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  /** Optional callback when rendered ParticipantItem is clicked */
  onParticipantClick?: (participant?: ParticipantListParticipant) => void;
  /** Styles for the {@link ParticipantList} */
  styles?: ParticipantListStyles;
};

const onRenderParticipantDefault = (
  participant: ParticipantListParticipant,
  strings: ParticipantItemStrings,
  myUserId?: string,
  onRenderAvatar?: OnRenderAvatarCallback,
  createParticipantMenuItems?: (participant: ParticipantListParticipant) => IContextualMenuItem[],
  styles?: ParticipantListItemStyles,
  onParticipantClick?: (participant?: ParticipantListParticipant) => void
): JSX.Element | null => {
  const callingParticipant = participant as CallParticipantListParticipant;

  let presence: PersonaPresence | undefined = undefined;
  if (callingParticipant) {
    if (callingParticipant.state === 'Connected') {
      presence = PersonaPresence.online;
    } else if (callingParticipant.state === 'Idle') {
      presence = PersonaPresence.away;
    }
  }

  const menuItems = createParticipantMenuItems && createParticipantMenuItems(participant);

  const onRenderIcon =
    callingParticipant?.isScreenSharing || callingParticipant?.isMuted
      ? () => (
          <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
            {callingParticipant.isScreenSharing && (
              <Icon
                iconName="ParticipantItemScreenShareStart"
                className={iconStyles}
                ariaLabel={strings.sharingIconLabel}
              />
            )}
            {callingParticipant.isMuted && (
              <Icon iconName="ParticipantItemMicOff" className={iconStyles} ariaLabel={strings.mutedIconLabel} />
            )}
          </Stack>
        )
      : () => null;

  const displayName = !participant.displayName ? strings.displayNamePlaceholder : participant.displayName;

  return (
    <ParticipantItem
      styles={styles}
      key={participant.userId}
      userId={participant.userId}
      displayName={displayName}
      me={myUserId ? participant.userId === myUserId : false}
      menuItems={menuItems}
      presence={presence}
      onRenderIcon={onRenderIcon}
      onRenderAvatar={onRenderAvatar}
      onClick={() => onParticipantClick?.(participant)}
    />
  );
};

const getParticipantsForDefaultRender = (
  participants: ParticipantListParticipant[],
  excludeMe: boolean,
  myUserId: string | undefined
): ParticipantListParticipant[] => {
  if (!excludeMe || !myUserId) {
    return [...participants];
  }

  const userIndex = participants.map((p) => p.userId).indexOf(myUserId);

  if (userIndex === -1) {
    return [...participants];
  }

  const remoteParticipants = [...participants];
  remoteParticipants.splice(userIndex, 1);

  return remoteParticipants;
};

/**
 * Component to render all calling or chat participants.
 *
 * By default, each participant is rendered with {@link ParticipantItem}. See {@link ParticipantListProps.onRenderParticipant} to override.
 *
 * @public
 */
export const ParticipantList = (props: ParticipantListProps): JSX.Element => {
  const {
    excludeMe = false,
    myUserId,
    participants,
    onRemoveParticipant,
    onRenderAvatar,
    onRenderParticipant,
    onFetchParticipantMenuItems
  } = props;

  const ids = useIdentifiers();
  const strings = useLocale().strings.participantItem;

  const displayedParticipants: ParticipantListParticipant[] = useMemo(() => {
    return onRenderParticipant ? participants : getParticipantsForDefaultRender(participants, excludeMe, myUserId);
  }, [participants, excludeMe, myUserId, onRenderParticipant]);

  const createParticipantMenuItems = (participant: ParticipantListParticipant): IContextualMenuItem[] => {
    let menuItems: IContextualMenuItem[] = [];
    if (participant.userId !== myUserId && onRemoveParticipant) {
      menuItems.push({
        key: 'remove',
        text: strings.removeButtonLabel,
        onClick: () => onRemoveParticipant(participant.userId),
        itemProps: {
          styles: props.styles?.participantItemStyles?.participantSubMenuItemsStyles
        },
        disabled: !participant.isRemovable,
        'data-ui-id': ids.participantListRemoveParticipantButton
      });
    }

    if (onFetchParticipantMenuItems) {
      menuItems = onFetchParticipantMenuItems(participant.userId, myUserId, menuItems);
    }

    return menuItems;
  };

  const participantItemStyles = merge(participantListItemStyle, props.styles?.participantItemStyles);
  return (
    <Stack data-ui-id={ids.participantList} className={mergeStyles(participantListStyle, props.styles?.root)}>
      {displayedParticipants.map((participant: ParticipantListParticipant) =>
        onRenderParticipant
          ? onRenderParticipant(participant)
          : onRenderParticipantDefault(
              participant,
              strings,
              myUserId,
              onRenderAvatar,
              createParticipantMenuItems,
              participantItemStyles,
              props.onParticipantClick
            )
      )}
    </Stack>
  );
};

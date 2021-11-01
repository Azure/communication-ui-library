// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenuItemType,
  IContextualMenuItem,
  IContextualMenuProps,
  Icon,
  IContextualMenuStyles,
  IContextualMenuItemStyles,
  merge
} from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import copy from 'copy-to-clipboard';
import React, { useCallback, useMemo } from 'react';
import {
  ParticipantList,
  ParticipantListProps,
  ParticipantListStyles,
  ParticipantMenuItemsCallback
} from './ParticipantList';
import { defaultParticipantListContainerStyle, participantsButtonMenuPropsStyle } from './styles/ControlBar.styles';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles } from './ControlBarButton';
import { useIdentifiers } from '../identifiers';
import { CommunicationParticipant } from '../types/CommunicationParticipant';
import { OnRenderAvatarCallback } from '../types/OnRender';

/**
 * Styles for the {@link ParticipantsButton} menu.
 *
 * @public
 */
export interface ParticipantsButtonContextualMenuStyles extends IContextualMenuStyles {
  /** Styles for the {@link ParticipantsButton} menu items. */
  menuItemStyles?: IContextualMenuItemStyles;
  /** Styles for the {@link ParticipantList} menu item inside the {@link ParticipantsButton} menu. */
  participantListStyles?: ParticipantListStyles;
}

/**
 * Styles Props for {@link ParticipantsButton}.
 *
 * @public
 */
export interface ParticipantsButtonStyles extends ControlBarButtonStyles {
  /** Styles of the {@link ParticipantsButton} menu flyout */
  menuStyles?: Partial<ParticipantsButtonContextualMenuStyles>;
}

/**
 * Strings of {@link ParticipantsButton} that can be overridden.
 *
 * @public
 */
export interface ParticipantsButtonStrings {
  /**
   * Label of button
   */
  label: string;
  /**
   * Header of menu pop up
   */
  menuHeader: string;
  /**
   * Label of menu button to show list of participants. Placeholders: [numParticipants]
   */
  participantsListButtonLabel: string;
  /**
   * Label of menu button to copy invite link
   */
  copyInviteLinkButtonLabel: string;
  /**
   * Label of menu button to mute all participants
   */
  muteAllButtonLabel: string;
}

/**
 * Props for {@link ParticipantsButton}.
 *
 * @public
 */
export interface ParticipantsButtonProps extends ControlBarButtonProps {
  /**
   * Participants in user call or chat
   */
  participants: CommunicationParticipant[];
  /**
   * User ID of user
   */
  myUserId?: string;
  /**
   * If set to `true`, excludes the local participant from the participant list with use of `myUserId` props (required in this case).
   *
   * @defaultValue `false`
   */
  excludeMe?: boolean;
  /**
   * Callback to render each participant. If no callback is provided, each participant will be rendered with `ParticipantItem`
   */
  onRenderParticipant?: (participant: CommunicationParticipant) => JSX.Element | null;
  /**
   * Callback to render the avatar for each participant. This property will have no effect if `onRenderParticipant` is assigned.
   */
  onRenderAvatar?: OnRenderAvatarCallback;
  /**
   * Callback to render the context menu for each participant
   */
  onParticipantRemove?: (userId: string) => void;
  /**
   * Callback to render custom menu items for each participant.
   */
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  /**
   * Optional callback to render a custom participant list.
   */
  onRenderParticipantList?: (props: ParticipantListProps) => JSX.Element | null;
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <ParticipantsButton styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: ParticipantsButtonStyles;
  /**
   * URL to invite new participants to the current call
   */
  callInvitationURL?: string;
  /**
   * CallBack to mute all remote participants
   */
  onMuteAll?: () => void;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<ParticipantsButtonStrings>;
}

const onRenderPeopleIcon = (): JSX.Element => {
  return <Icon iconName="ControlButtonParticipants" />;
};

/**
 * A button to show a menu with calling or chat participants.
 *
 * Can be used with {@link ControlBar}.
 *
 * This button contains dropdown menu items defined through its property `menuProps`. By default, it can display the number of remote participants with the full list
 * as sub-menu and an option to mute all participants, as well as a copy-to-clipboard button to copy the call invitation URL.
 * This `menuProps` can be fully redefined and its property is of type [IContextualMenuProps](https://developer.microsoft.com/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
 *
 * @public
 */
export const ParticipantsButton = (props: ParticipantsButtonProps): JSX.Element => {
  const {
    callInvitationURL,
    styles,
    onMuteAll,
    onRenderIcon,
    onRenderParticipantList,
    participants,
    myUserId,
    excludeMe,
    onRenderParticipant,
    onRenderAvatar,
    onParticipantRemove,
    onFetchParticipantMenuItems
  } = props;

  const ids = useIdentifiers();

  const onMuteAllCallback = useCallback(() => {
    if (onMuteAll) {
      onMuteAll();
    }
  }, [onMuteAll]);

  const defaultParticipantList = useCallback(() => {
    return (
      <ParticipantList
        participants={participants}
        myUserId={myUserId}
        excludeMe={excludeMe}
        onRenderParticipant={onRenderParticipant}
        onRenderAvatar={onRenderAvatar}
        onParticipantRemove={onParticipantRemove}
        onFetchParticipantMenuItems={onFetchParticipantMenuItems}
        styles={merge(defaultParticipantListContainerStyle, styles?.menuStyles?.participantListStyles)}
      />
    );
  }, [
    excludeMe,
    myUserId,
    onParticipantRemove,
    onRenderAvatar,
    onRenderParticipant,
    participants,
    styles?.menuStyles?.participantListStyles,
    onFetchParticipantMenuItems
  ]);

  const onCopyCallback = useCallback(() => {
    if (callInvitationURL) {
      return copy(callInvitationURL);
    }
    return false;
  }, [callInvitationURL]);

  const localeStrings = useLocale().strings.participantsButton;
  const strings = useMemo(() => ({ ...localeStrings, ...props.strings }), [localeStrings, props.strings]);
  const participantCount = participants.length;

  const generateDefaultParticipantsSubMenuProps = useCallback((): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [];

    if (participantCount > 0) {
      items.push({
        key: 'participantListMenuItemKey',
        onRender: onRenderParticipantList ?? defaultParticipantList
      });

      items.push({ key: 'participantsDivider1', itemType: ContextualMenuItemType.Divider });

      if (onMuteAll) {
        items.push({
          key: 'muteAllKey',
          text: strings.muteAllButtonLabel,
          title: strings.muteAllButtonLabel,
          styles: styles?.menuStyles?.menuItemStyles,
          iconProps: { iconName: 'MicOff2' },
          onClick: onMuteAllCallback
        });
      }
    }

    return items;
  }, [
    participantCount,
    onRenderParticipantList,
    defaultParticipantList,
    onMuteAll,
    strings.muteAllButtonLabel,
    styles?.menuStyles?.menuItemStyles,
    onMuteAllCallback
  ]);

  const defaultMenuProps = useMemo((): IContextualMenuProps => {
    const menuProps: IContextualMenuProps = {
      title: strings.menuHeader,
      styles: merge(participantsButtonMenuPropsStyle, styles?.menuStyles),
      items: []
    };

    if (participantCount > 0) {
      const participantIds = participants.map((p) => p.userId);

      let participantCountWithoutMe = participantIds.length;
      if (excludeMe) {
        participantCountWithoutMe -= 1;
      }

      menuProps.items.push({
        key: 'participantCountKey',
        name: _formatString(strings.participantsListButtonLabel, { numParticipants: `${participantCountWithoutMe}` }),
        itemProps: { styles: styles?.menuStyles?.menuItemStyles },
        iconProps: { iconName: 'People' },
        subMenuProps: {
          items: generateDefaultParticipantsSubMenuProps(),

          // Confine the menu to the parents bounds.
          // More info: https://github.com/microsoft/fluentui/issues/18835
          calloutProps: { styles: { root: { maxWidth: '100%' } } }
        },
        'data-ui-id': ids.participantButtonPeopleMenuItem
      });
    }

    if (callInvitationURL) {
      menuProps.items.push({
        key: 'InviteLinkKey',
        name: strings.copyInviteLinkButtonLabel,
        title: strings.copyInviteLinkButtonLabel,
        itemProps: { styles: styles?.menuStyles?.menuItemStyles },
        iconProps: { iconName: 'Link' },
        onClick: onCopyCallback
      });
    }

    return menuProps;
  }, [
    strings.menuHeader,
    strings.participantsListButtonLabel,
    strings.copyInviteLinkButtonLabel,
    styles?.menuStyles,
    participantCount,
    callInvitationURL,
    participants,
    excludeMe,
    ids.participantButtonPeopleMenuItem,
    generateDefaultParticipantsSubMenuProps,
    onCopyCallback
  ]);

  return (
    <ControlBarButton
      {...props}
      menuProps={props.menuProps ?? defaultMenuProps}
      menuIconProps={{ hidden: true }}
      onRenderIcon={onRenderIcon ?? onRenderPeopleIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'participantsButtonLabel'}
    />
  );
};

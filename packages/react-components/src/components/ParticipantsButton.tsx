// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenuItemType,
  IContextualMenuItem,
  IContextualMenuProps,
  IStyle,
  Stack,
  mergeStyles,
  Icon
} from '@fluentui/react';
import { formatString } from '@internal/acs-ui-common';
import copy from 'copy-to-clipboard';
import React, { useCallback, useMemo } from 'react';
import { ParticipantList, ParticipantListProps } from './ParticipantList';
import { defaultParticipantListContainerStyle, participantsButtonMenuPropsStyle } from './styles/ControlBar.styles';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps, ControlBarButtonStyles } from './ControlBarButton';

/**
 * Styles Props for {@link ParticipantsButton}.
 *
 * @public
 */
export interface ParticipantsButtonStyles extends ControlBarButtonStyles {
  /** Styles of ParticipantList container */
  participantListContainerStyle?: IStyle;
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
export interface ParticipantsButtonProps extends ControlBarButtonProps, ParticipantListProps {
  /**
   * Optional callback to render the participant list.
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

  const onMuteAllCallback = useCallback(() => {
    if (onMuteAll) {
      onMuteAll();
    }
  }, [onMuteAll]);

  const defaultParticipantList = useCallback(() => {
    return (
      <Stack className={mergeStyles(defaultParticipantListContainerStyle, styles?.participantListContainerStyle)}>
        <ParticipantList
          participants={participants}
          myUserId={myUserId}
          excludeMe={excludeMe}
          onRenderParticipant={onRenderParticipant}
          onRenderAvatar={onRenderAvatar}
          onParticipantRemove={onParticipantRemove}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
        />
      </Stack>
    );
  }, [
    excludeMe,
    myUserId,
    onParticipantRemove,
    onRenderAvatar,
    onRenderParticipant,
    participants,
    styles?.participantListContainerStyle,
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
    onMuteAllCallback
  ]);

  const defaultMenuProps = useMemo((): IContextualMenuProps => {
    const menuProps: IContextualMenuProps = {
      title: strings.menuHeader,
      styles: participantsButtonMenuPropsStyle,
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
        name: formatString(strings.participantsListButtonLabel, { numParticipants: `${participantCountWithoutMe}` }),
        iconProps: { iconName: 'People' },
        subMenuProps: {
          items: generateDefaultParticipantsSubMenuProps(),

          // Confine the menu to the parents bounds.
          // More info: https://github.com/microsoft/fluentui/issues/18835
          calloutProps: { styles: { root: { maxWidth: '100%' } } }
        }
      });
    }

    if (callInvitationURL) {
      menuProps.items.push({
        key: 'InviteLinkKey',
        name: strings.copyInviteLinkButtonLabel,
        title: strings.copyInviteLinkButtonLabel,
        iconProps: { iconName: 'Link' },
        onClick: onCopyCallback
      });
    }

    return menuProps;
  }, [
    strings.menuHeader,
    strings.participantsListButtonLabel,
    strings.copyInviteLinkButtonLabel,
    participantCount,
    callInvitationURL,
    participants,
    excludeMe,
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

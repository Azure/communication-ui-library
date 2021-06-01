// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  ContextualMenuItemType,
  DefaultButton,
  IButtonProps,
  IContextualMenuItem,
  IContextualMenuProps,
  IStyle,
  Label,
  mergeStyles,
  Stack
} from '@fluentui/react';
import { UserFriendsIcon } from '@fluentui/react-northstar';
import copy from 'copy-to-clipboard';
import React from 'react';
import { ParticipantList, ParticipantListProps } from './ParticipantList';
import {
  controlButtonLabelStyles,
  controlButtonStyles,
  defaultParticipantListContainerStyle
} from './styles/ControlBar.styles';

/**
 * Props for ParticipantListButton component
 */
export interface ParticipantListButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;
  /**
   * Props of ParticipantList component
   */
  participantListProps?: ParticipantListProps;
  /**
   * Styles of ParticipantList container
   */
  participantListContainerStyle?: IStyle;
  /**
   * Call Invite URL
   */
  callInviteURL?: string;
  /**
   * CallBack to mute all remote participants
   *
   * @param userId - ID of user requesting to mute all remote participants
   */
  onMuteAll?: (userId?: string) => void;
}

/**
 * Generates default remote participants subMenuprops for a ParticipantListButton if the props contain participantListProps.
 *
 * @param props ParticipantListButtonProps
 * @returns an array of IContextualMenuItem
 */
const generateDefaultRemoteParticipantsSubMenuProps = (props: ParticipantListButtonProps): IContextualMenuItem[] => {
  const { participantListProps, onMuteAll } = props;
  const items: IContextualMenuItem[] = [];

  if (participantListProps && participantListProps.participants.length > 0) {
    const remoteParticipantListProps = { ...participantListProps };

    if (participantListProps.myUserId) {
      remoteParticipantListProps.participants = participantListProps.participants.filter(
        (p) => p.userId !== participantListProps.myUserId
      );
    }

    items.push({
      key: 'remoteParticipantsKey',
      text: 'Remote Participant list',
      onRender: () => {
        return (
          <Stack className={mergeStyles(defaultParticipantListContainerStyle, props?.participantListContainerStyle)}>
            <ParticipantList {...remoteParticipantListProps} />
          </Stack>
        );
      }
    });

    items.push({ key: 'participantsDivider1', itemType: ContextualMenuItemType.Divider });

    if (onMuteAll) {
      items.push({
        key: 'muteAllKey',
        text: 'Mute all',
        title: 'Mute all',
        iconProps: { iconName: 'MicOff2' },
        onClick: () => onMuteAll(participantListProps.myUserId)
      });
    }
  }

  return items;
};

/**
 * Generates default menuprops for a ParticipantListButton
 *
 * @param props ParticipantListButtonProps
 * @returns IContextualMenuProps
 */
const generateDefaultMenuProps = (props: ParticipantListButtonProps): IContextualMenuProps => {
  const { participantListProps, callInviteURL } = props;

  const defaultMenuProps: IContextualMenuProps = {
    items: []
  };

  if (participantListProps && participantListProps.participants.length > 0) {
    const participantIds = participantListProps.participants.map((p) => p.userId);
    let remoteParticipantCount = participantIds.length;

    if (participantListProps.myUserId && participantIds.indexOf(participantListProps?.myUserId) !== -1) {
      remoteParticipantCount -= 1;
      defaultMenuProps.items.push({
        key: 'selfParticipantKey',
        name: 'In this call'
      });
    }

    defaultMenuProps.items.push({
      key: 'remoteParticipantCountKey',
      name: `${remoteParticipantCount} people`,
      iconProps: { iconName: 'People' },
      subMenuProps: {
        items: generateDefaultRemoteParticipantsSubMenuProps(props)
      }
    });
  }

  if (callInviteURL) {
    defaultMenuProps.items.push({
      key: 'InviteLinkKey',
      name: 'Copy invite link',
      iconProps: { iconName: 'Link' },
      onClick: () => {
        copy(callInviteURL);
      }
    });
  }

  return defaultMenuProps;
};

/**
 * `ParticipantListButton` allows you to easily create a component rendering a ParticipantList button. It can be used in your ControlBar component for example.
 * This button, by default, contains dropdown menu items defined through its property `menuProps` (user presence, number of remote participants with a list
 * as sub-menu and a copy-to-clipboard button of the call invite URL).
 * This `menuProps` property is of type [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
 *
 * @param props - of type ParticipantListButtonProps
 */
export const ParticipantListButton = (props: ParticipantListButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;

  const defaultMenuProps = generateDefaultMenuProps(props);

  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (): JSX.Element => {
    return <UserFriendsIcon key={'participantListIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'participantListLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {'Participants'}
      </Label>
    );
  };

  return (
    <DefaultButton
      {...props}
      menuProps={props.menuProps ?? defaultMenuProps}
      menuIconProps={{ hidden: true }}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};

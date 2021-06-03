// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenuItemType,
  DefaultButton,
  IButtonProps,
  IContextualMenuItem,
  IContextualMenuProps,
  IStyle,
  Label,
  Stack,
  concatStyleSets,
  mergeStyles
} from '@fluentui/react';
import { UserFriendsIcon } from '@fluentui/react-northstar';
import copy from 'copy-to-clipboard';
import React, { useCallback, useMemo } from 'react';
import { ParticipantList, ParticipantListProps } from './ParticipantList';
import {
  controlButtonLabelStyles,
  controlButtonStyles,
  defaultParticipantListContainerStyle
} from './styles/ControlBar.styles';
import { BaseCustomStylesProps } from '../types';

/**
 * Styles Props for ParticipantsButton component
 */
export interface ParticipantsButtonStylesProps extends BaseCustomStylesProps {
  /** Styles of ParticipantList container */
  participantListContainerStyle?: IStyle;
}

/**
 * Props for ParticipantsButton component
 */
export interface ParticipantsButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   *
   * @default false
   *
   */
  showLabel?: boolean;
  /**
   * Props of ParticipantList component
   */
  participantListProps: ParticipantListProps;
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <MessageThread styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: ParticipantsButtonStylesProps;
  /**
   * URL to invite new participants to the current call
   */
  callInvitationURL?: string;
  /**
   * CallBack to mute all remote participants
   */
  onMuteAll?: () => void;
}

/**
 * `ParticipantsButton` allows you to easily create a component rendering a participants button. It can be used in your ControlBar component for example.
 * This button, by default, contains dropdown menu items defined through its property `menuProps` (user presence, number of remote participants with a list
 * as sub-menu and a copy-to-clipboard button of the call invite URL).
 * This `menuProps` property is of type [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
 *
 * @param props - of type ParticipantsButtonProps
 */
export const ParticipantsButton = (props: ParticipantsButtonProps): JSX.Element => {
  const {
    participantListProps,
    showLabel = false,
    callInvitationURL,
    styles,
    onMuteAll,
    onRenderIcon,
    onRenderText
  } = props;

  const onMuteAllCallback = useCallback(() => {
    if (onMuteAll) {
      onMuteAll();
    }
  }, [onMuteAll]);

  // Rendering of ParticipantList excluding the local user as we display them on their own in the context menu
  const onRenderCallback = useCallback(() => {
    return (
      <Stack className={mergeStyles(defaultParticipantListContainerStyle, styles?.participantListContainerStyle)}>
        <ParticipantList {...participantListProps} excludeMe={true} />
      </Stack>
    );
  }, [participantListProps, styles]);

  const onCopyCallback = useCallback(() => {
    if (callInvitationURL) {
      return copy(callInvitationURL);
    }
    return false;
  }, [callInvitationURL]);

  const generateDefaultRemoteParticipantsSubMenuProps = (): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [];

    if (participantListProps.participants.length > 0) {
      items.push({
        key: 'remoteParticipantsKey',
        text: 'Remote Participant list',
        onRender: onRenderCallback
      });

      items.push({ key: 'participantsDivider1', itemType: ContextualMenuItemType.Divider });

      if (onMuteAll) {
        items.push({
          key: 'muteAllKey',
          text: 'Mute all',
          title: 'Mute all',
          iconProps: { iconName: 'MicOff2' },
          onClick: onMuteAllCallback
        });
      }
    }

    return items;
  };

  const defaultMenuProps = useMemo((): IContextualMenuProps => {
    const menuProps: IContextualMenuProps = {
      items: []
    };

    if (participantListProps.participants.length > 0) {
      const participantIds = participantListProps.participants.map((p) => p.userId);
      let participantCount = participantIds.length;

      if (participantListProps.myUserId && participantIds.indexOf(participantListProps.myUserId) !== -1) {
        participantCount -= 1;
        menuProps.items.push({
          key: 'selfParticipantKey',
          name: 'In this call'
        });
      }

      menuProps.items.push({
        key: 'remoteParticipantCountKey',
        name: `${participantCount} people`,
        iconProps: { iconName: 'People' },
        subMenuProps: {
          items: generateDefaultRemoteParticipantsSubMenuProps()
        }
      });
    }

    if (callInvitationURL) {
      menuProps.items.push({
        key: 'InviteLinkKey',
        name: 'Copy invite link',
        iconProps: { iconName: 'Link' },
        onClick: onCopyCallback
      });
    }

    return menuProps;
  }, [
    participantListProps,
    participantListProps.participants,
    participantListProps?.myUserId,
    callInvitationURL,
    styles?.participantListContainerStyle
  ]);

  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (): JSX.Element => {
    return <UserFriendsIcon key={'participantsIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'participantsLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {'People'}
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

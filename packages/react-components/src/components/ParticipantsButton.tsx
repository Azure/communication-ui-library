// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenuItemType,
  DefaultButton,
  IButtonProps,
  IButtonStyles,
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
import React from 'react';
import { ParticipantList, ParticipantListProps } from './ParticipantList';
import {
  controlButtonLabelStyles,
  controlButtonStyles,
  defaultParticipantListContainerStyle
} from './styles/ControlBar.styles';

/**
 * Styles Props for ParticipantsButton component
 */
export interface ParticipantsButtonStylesProps extends IButtonStyles {
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
 * Generates default remote participants subMenuprops for a ParticipantsButton if the props contain participantListProps.
 *
 * @param props ParticipantsButtonProps with user exclusion
 * @returns an array of IContextualMenuItem
 */
const generateDefaultRemoteParticipantsSubMenuProps = (props: ParticipantsButtonProps): IContextualMenuItem[] => {
  const { participantListProps, onMuteAll } = props;
  const items: IContextualMenuItem[] = [];

  if (participantListProps.participants.length > 0) {
    items.push({
      key: 'remoteParticipantsKey',
      text: 'Remote Participant list',
      onRender: () => {
        return (
          <Stack
            className={mergeStyles(defaultParticipantListContainerStyle, props?.styles?.participantListContainerStyle)}
          >
            <ParticipantList {...participantListProps} />
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
        onClick: () => onMuteAll()
      });
    }
  }

  return items;
};

/**
 * Generates default menuprops for a ParticipantsButton
 *
 * @param props ParticipantsButtonProps
 * @returns IContextualMenuProps
 */
const generateDefaultMenuProps = (props: ParticipantsButtonProps): IContextualMenuProps => {
  const { participantListProps, callInvitationURL } = props;

  const defaultMenuProps: IContextualMenuProps = {
    items: []
  };

  if (participantListProps.participants.length > 0) {
    const remoteParticipantsButtonProps = { ...props };
    remoteParticipantsButtonProps.participantListProps.excludeMe = true;

    const participantIds = participantListProps.participants.map((p) => p.userId);
    let remoteParticipantCount = participantIds.length;

    if (participantListProps.myUserId && participantIds.indexOf(participantListProps.myUserId) !== -1) {
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
        items: generateDefaultRemoteParticipantsSubMenuProps(remoteParticipantsButtonProps)
      }
    });
  }

  if (callInvitationURL) {
    defaultMenuProps.items.push({
      key: 'InviteLinkKey',
      name: 'Copy invite link',
      iconProps: { iconName: 'Link' },
      onClick: () => {
        return copy(callInvitationURL);
      }
    });
  }

  return defaultMenuProps;
};

/**
 * `ParticipantsButton` allows you to easily create a component rendering a participants button. It can be used in your ControlBar component for example.
 * This button, by default, contains dropdown menu items defined through its property `menuProps` (user presence, number of remote participants with a list
 * as sub-menu and a copy-to-clipboard button of the call invite URL).
 * This `menuProps` property is of type [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
 *
 * @param props - of type ParticipantsButtonProps
 */
export const ParticipantsButton = (props: ParticipantsButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;

  const defaultMenuProps = React.useMemo(() => {
    return generateDefaultMenuProps(props);
  }, [props.participantListProps.participants, props.participantListProps?.myUserId, props?.callInvitationURL]);

  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (): JSX.Element => {
    return <UserFriendsIcon key={'participantsIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'participantsLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
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

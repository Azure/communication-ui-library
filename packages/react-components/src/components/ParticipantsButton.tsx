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
import { People20Filled } from '@fluentui/react-icons';
import copy from 'copy-to-clipboard';
import React, { useCallback, useMemo } from 'react';
import { ParticipantList, ParticipantListProps } from './ParticipantList';
import {
  controlButtonLabelStyles,
  controlButtonStyles,
  defaultParticipantListContainerStyle,
  participantsButtonMenuPropsStyle
} from './styles/ControlBar.styles';
import { ButtonCustomStylesProps } from '../types';

/**
 * Styles Props for ParticipantsButton component
 */
export interface ParticipantsButtonStylesProps extends ButtonCustomStylesProps {
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
   * <ParticipantsButton styles={{ root: { background: 'blue' } }} />
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
 * This button contains dropdown menu items defined through its property `menuProps`. By default, it can display the number of remote participants with the full list
 * as sub-menu and an option to mute all participants, as well as a copy-to-clipboard button to copy the call invitation URL.
 * This `menuProps` can be fully redefined and its property is of type [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
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

  const onRenderCallback = useCallback(() => {
    return (
      <Stack className={mergeStyles(defaultParticipantListContainerStyle, styles?.participantListContainerStyle)}>
        <ParticipantList {...participantListProps} />
      </Stack>
    );
  }, [participantListProps, styles]);

  const onCopyCallback = useCallback(() => {
    if (callInvitationURL) {
      return copy(callInvitationURL);
    }
    return false;
  }, [callInvitationURL]);

  const generateDefaultParticipantsSubMenuProps = (): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [];

    if (participantListProps.participants.length > 0) {
      items.push({
        key: 'participantListMenuItemKey',
        text: 'Participant list',
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
      title: 'In this call',
      styles: participantsButtonMenuPropsStyle,
      items: []
    };

    if (participantListProps.participants.length > 0) {
      const participantIds = participantListProps.participants.map((p) => p.userId);

      let participantCount = participantIds.length;
      if (participantListProps.excludeMe) {
        participantCount -= 1;
      }

      menuProps.items.push({
        key: 'participantCountKey',
        name: `${participantCount} people`,
        iconProps: { iconName: 'People' },
        subMenuProps: {
          items: generateDefaultParticipantsSubMenuProps()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    participantListProps,
    participantListProps.participants,
    participantListProps?.myUserId,
    callInvitationURL,
    styles?.participantListContainerStyle
  ]);

  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (): JSX.Element => {
    return <People20Filled key={'participantsIconKey'} primaryFill="currentColor" />;
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

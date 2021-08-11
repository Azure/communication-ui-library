// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ContextualMenuItemType,
  IContextualMenuItem,
  IContextualMenuProps,
  IStyle,
  Stack,
  mergeStyles
} from '@fluentui/react';
import { People20Filled } from '@fluentui/react-icons';
import copy from 'copy-to-clipboard';
import React, { useCallback, useMemo } from 'react';
import { ParticipantList, ParticipantListProps } from './ParticipantList';
import { defaultParticipantListContainerStyle, participantsButtonMenuPropsStyle } from './styles/ControlBar.styles';
import { useLocale } from '../localization';
import { formatString } from '../localization/localizationUtils';
import { ButtonCustomStylesProps } from '../types';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';

/**
 * Styles Props for ParticipantsButton component
 */
export interface ParticipantsButtonStylesProps extends ButtonCustomStylesProps {
  /** Styles of ParticipantList container */
  participantListContainerStyle?: IStyle;
}

/**
 * Strings of ParticipantsButtonStrings that can be overridden
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
 * Props for ParticipantsButton component
 */
export interface ParticipantsButtonProps extends ControlBarButtonProps {
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
  /**
   * Optional strings to override in component
   */
  strings?: Partial<ParticipantsButtonStrings>;
}

const onRenderPeopleIcon = (): JSX.Element => {
  return <People20Filled key={'participantsIconKey'} primaryFill="currentColor" />;
};

/**
 * `ParticipantsButton` allows you to easily create a component rendering a participants button. It can be used in your ControlBar component for example.
 * This button contains dropdown menu items defined through its property `menuProps`. By default, it can display the number of remote participants with the full list
 * as sub-menu and an option to mute all participants, as well as a copy-to-clipboard button to copy the call invitation URL.
 * This `menuProps` can be fully redefined and its property is of type [IContextualMenuProps](https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps).
 *
 * @param props - of type ParticipantsButtonProps
 */
export const ParticipantsButton = (props: ParticipantsButtonProps): JSX.Element => {
  const { participantListProps, callInvitationURL, styles, onMuteAll, onRenderIcon } = props;

  const onMuteAllCallback = useCallback(() => {
    if (onMuteAll) {
      onMuteAll();
    }
  }, [onMuteAll]);

  const onRenderParticipantList = useCallback(() => {
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

  const localeStrings = useLocale().strings.participantsButton;
  const strings = useMemo(() => ({ ...localeStrings, ...props.strings }), [localeStrings, props.strings]);
  const participantCount = participantListProps.participants.length;

  const generateDefaultParticipantsSubMenuProps = useCallback((): IContextualMenuItem[] => {
    const items: IContextualMenuItem[] = [];

    if (participantCount > 0) {
      items.push({
        key: 'participantListMenuItemKey',
        onRender: onRenderParticipantList
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
  }, [strings, participantCount, onRenderParticipantList, onMuteAll, onMuteAllCallback]);

  const defaultMenuProps = useMemo((): IContextualMenuProps => {
    const menuProps: IContextualMenuProps = {
      title: strings.menuHeader,
      styles: participantsButtonMenuPropsStyle,
      items: []
    };

    if (participantCount > 0) {
      const participantIds = participantListProps.participants.map((p) => p.userId);

      let participantCountWithoutMe = participantIds.length;
      if (participantListProps.excludeMe) {
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
    participantListProps.participants,
    participantListProps.excludeMe,
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

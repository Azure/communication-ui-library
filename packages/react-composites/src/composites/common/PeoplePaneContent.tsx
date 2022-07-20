// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  DefaultButton,
  IButtonStyles,
  IContextualMenuItem,
  PrimaryButton,
  Stack,
  useTheme
} from '@fluentui/react';
import {
  ParticipantList,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  _DrawerMenuItemProps
} from '@internal/react-components';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
import { CallWithChatCompositeStrings } from '../CallWithChatComposite';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { CallWithChatCompositeIcon } from '../common/icons';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
import {
  copyLinkButtonStackStyles,
  copyLinkButtonContainerStyles,
  copyLinkButtonStyles,
  linkIconStyles,
  participantListContainerStyles,
  peoplePaneContainerStyle
} from './styles/PeoplePaneContent.styles';
import { themedCopyLinkButtonStyles } from './styles/PeoplePaneContent.styles';
import { AddPeopleDropdown } from '../CallWithChatComposite/components/AddPeopleDropdown';
import { convertContextualMenuItemToDrawerMenuItem } from '../CallWithChatComposite/ConvertContextualMenuItemToDrawerMenuItem';

/**
 * @private
 */
export const PeoplePaneContent = (props: {
  inviteLink?: string;
  onRemoveParticipant: (participantId: string) => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  strings: CallWithChatCompositeStrings;
  setDrawerMenuItems: (_DrawerMenuItemProps) => void;
  mobileView?: boolean;
}): JSX.Element => {
  const { inviteLink, onFetchParticipantMenuItems, setDrawerMenuItems, strings, onRemoveParticipant } = props;

  const participantListDefaultProps = usePropsFor(ParticipantList);

  const setDrawerMenuItemsForParticipant: (participant?: ParticipantListParticipant) => void = useMemo(() => {
    return (participant?: ParticipantListParticipant) => {
      if (participant) {
        let contextualMenuItems: IContextualMenuItem[] = createDefaultContextualMenuItems(
          participant,
          strings,
          participantListDefaultProps.onRemoveParticipant,
          participantListDefaultProps.myUserId
        );
        if (onFetchParticipantMenuItems) {
          contextualMenuItems = onFetchParticipantMenuItems(
            participant.userId,
            participantListDefaultProps.myUserId,
            contextualMenuItems
          );
        }
        const drawerMenuItems = contextualMenuItems.map((contextualMenu: IContextualMenuItem) =>
          convertContextualMenuItemToDrawerMenuItem(contextualMenu, () => setDrawerMenuItems([]))
        );
        setDrawerMenuItems(drawerMenuItems);
      }
    };
  }, [
    strings,
    participantListDefaultProps.onRemoveParticipant,
    participantListDefaultProps.myUserId,
    onFetchParticipantMenuItems,
    setDrawerMenuItems
  ]);

  const participantListProps: ParticipantListProps = useMemo(() => {
    const onRemoveAParticipant = async (participantId: string): Promise<void> => onRemoveParticipant(participantId);
    return {
      ...participantListDefaultProps,
      // Passing undefined callback for mobile to avoid context menus for participants in ParticipantList are clicked
      onRemoveParticipant: props.mobileView ? undefined : onRemoveAParticipant,
      // We want the drawer menu items to appear when participants in ParticipantList are clicked
      onParticipantClick: props.mobileView ? setDrawerMenuItemsForParticipant : undefined
    };
  }, [participantListDefaultProps, props.mobileView, setDrawerMenuItemsForParticipant, onRemoveParticipant]);

  const participantList = (
    <ParticipantListWithHeading
      isMobile={props.mobileView}
      participantListProps={participantListProps}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
      title={props.strings.peoplePaneSubTitle}
    />
  );

  const theme = useTheme();

  const copyLinkButtonStylesThemed = useMemo(
    (): IButtonStyles => concatStyleSets(copyLinkButtonStyles, themedCopyLinkButtonStyles(props.mobileView, theme)),
    [props.mobileView, theme]
  );

  // for conditional compile
  const mobileViewAddPeopleButton = (inviteLink?: string): JSX.Element => {
    /* @conditional-compile-remove(people-pane-dropdown) */
    return <AddPeopleDropdown strings={strings} mobileView={props.mobileView} inviteLink={inviteLink} />;

    return (
      <Stack>
        {inviteLink && (
          <Stack.Item styles={copyLinkButtonContainerStyles}>
            <PrimaryButton
              onClick={() => copy(inviteLink ?? '')}
              styles={copyLinkButtonStylesThemed}
              onRenderIcon={() => <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />}
              text={strings.copyInviteLinkButtonLabel}
            />
          </Stack.Item>
        )}
      </Stack>
    );
  };

  const desktopViewAddPeopleButton = (inviteLink?: string): JSX.Element => {
    /* @conditional-compile-remove(people-pane-dropdown) */
    return (
      <Stack tokens={peoplePaneContainerTokens}>
        <AddPeopleDropdown strings={strings} mobileView={props.mobileView} inviteLink={inviteLink} />
        {participantList}
      </Stack>
    );

    return (
      <Stack tokens={peoplePaneContainerTokens}>
        {inviteLink && (
          <Stack styles={copyLinkButtonStackStyles}>
            <DefaultButton
              text={strings.copyInviteLinkButtonLabel}
              onRenderIcon={() => <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />}
              onClick={() => copy(inviteLink ?? '')}
              styles={copyLinkButtonStylesThemed}
            />
          </Stack>
        )}
        {participantList}
      </Stack>
    );
  };
  if (props.mobileView) {
    return (
      <Stack verticalFill styles={peoplePaneContainerStyle} tokens={peoplePaneContainerTokens}>
        <Stack.Item grow styles={participantListContainerStyles}>
          {participantList}
        </Stack.Item>

        {mobileViewAddPeopleButton(inviteLink)}
      </Stack>
    );
  }

  return desktopViewAddPeopleButton(inviteLink);
};

/**
 * Create default contextual menu items for particant
 * @param participant - participant to create contextual menu items for
 * @param callWithChatStrings - localized strings for menu item text
 * @param onRemoveParticipant - callback to remove participant
 * @param localParticipantUserId - Local participant user id
 * @returns - IContextualMenuItem[]
 */
const createDefaultContextualMenuItems = (
  participant: ParticipantListParticipant,
  strings: CallWithChatCompositeStrings,
  onRemoveParticipant: (userId: string) => Promise<void>,
  localParticipantUserId?: string
): IContextualMenuItem[] => {
  const menuItems: IContextualMenuItem[] = [];
  if (participant?.userId !== localParticipantUserId) {
    menuItems.push({
      key: 'remove',
      text: strings.removeMenuLabel,
      onClick: () => {
        if (participant?.userId) {
          onRemoveParticipant?.(participant?.userId);
        }
      },
      iconProps: {
        iconName: 'UserRemove'
      },
      disabled: !participant.isRemovable
    });
  }
  return menuItems;
};

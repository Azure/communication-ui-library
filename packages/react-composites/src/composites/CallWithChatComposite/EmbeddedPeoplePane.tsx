// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { DefaultButton, FontIcon, IContextualMenuItem, PrimaryButton, Stack } from '@fluentui/react';
import {
  ParticipantList,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  _DrawerMenu,
  _DrawerMenuItemProps
} from '@internal/react-components';
import copy from 'copy-to-clipboard';
import React, { useMemo, useState } from 'react';
import { CallWithChatCompositeStrings } from '.';
import { CallAdapter } from '../CallComposite';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { ChatAdapter } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { peoplePaneContainerStyle, peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { MobilePane } from './MobilePane';
import { SidePane } from './SidePane';
import { drawerContainerStyles } from './styles/CallWithChatCompositeStyles';
import { copyLinkButtonStyles, linkIconStyles } from './styles/EmbeddedPeoplePane.styles';

/**
 * @private
 */
export const EmbeddedPeoplePane = (props: {
  inviteLink?: string;
  onClose: () => void;
  hidden: boolean;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onChatButtonClick: () => void;
  onPeopleButtonClick: () => void;
  mobileView?: boolean;
}): JSX.Element => {
  const { callAdapter, chatAdapter, inviteLink } = props;
  const participantListDefaultProps = usePropsFor(ParticipantList);

  const callWithChatStrings = useCallWithChatCompositeStrings();

  const [drawerMenuItems, setDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);

  const setDrawerMenuItemsForParticipant: (participant?: ParticipantListParticipant) => void = useMemo(() => {
    return (participant?: ParticipantListParticipant) => {
      if (participant) {
        let contextualMenuItems: IContextualMenuItem[] = createDefaultContextualMenuItems(
          participant,
          callWithChatStrings,
          participantListDefaultProps.onRemoveParticipant,
          participantListProps.myUserId
        );
        if (props.onFetchParticipantMenuItems) {
          contextualMenuItems = props.onFetchParticipantMenuItems(
            participant.userId,
            participantListProps.myUserId,
            contextualMenuItems
          );
        }
        const drawerMenuItems = contextualMenuItems.map((contextualMenu: IContextualMenuItem) =>
          convertContextualMenuItemToDrawerMenuItem(contextualMenu, () => setDrawerMenuItems([]))
        );
        setDrawerMenuItems(drawerMenuItems);
      }
    };
  }, []);

  const participantListProps: ParticipantListProps = useMemo(() => {
    const onRemoveParticipant = async (participantId: string): Promise<void> =>
      removeParticipantFromCallWithChat(callAdapter, chatAdapter, participantId);
    return {
      ...participantListDefaultProps,
      // Passing undefined callback for mobile to avoid context menus for participants in ParticipantList are clicked
      onRemoveParticipant: props.mobileView ? undefined : onRemoveParticipant,
      // We want the drawer menu items to appear when participants in ParticipantList are clicked
      onParticipantClick: props.mobileView ? setDrawerMenuItemsForParticipant : undefined
    };
  }, [participantListDefaultProps, callAdapter, chatAdapter]);

  const participantList = (
    <ParticipantListWithHeading
      participantListProps={participantListProps}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
      title={callWithChatStrings.peoplePaneSubTitle}
    />
  );

  if (props.mobileView) {
    return (
      <MobilePane
        hidden={props.hidden}
        dataUiId={'call-with-chat-composite-people-pane'}
        onClose={props.onClose}
        activeTab="people"
        onChatButtonClicked={props.onChatButtonClick}
        onPeopleButtonClicked={props.onPeopleButtonClick}
      >
        <Stack verticalFill styles={peoplePaneContainerStyle} tokens={peoplePaneContainerTokens}>
          {participantList}
          {inviteLink && (
            <PrimaryButton
              onClick={() => copy(inviteLink)}
              styles={copyLinkButtonStyles}
              onRenderIcon={() => <FontIcon iconName="Link" style={linkIconStyles} />}
              text={callWithChatStrings.copyInviteLinkButtonLabel}
            />
          )}
        </Stack>
        {drawerMenuItems.length > 0 && (
          <Stack styles={drawerContainerStyles}>
            <_DrawerMenu onLightDismiss={() => setDrawerMenuItems([])} items={drawerMenuItems} />
          </Stack>
        )}
      </MobilePane>
    );
  }

  return (
    <SidePane
      hidden={props.hidden}
      headingText={callWithChatStrings.peoplePaneTitle}
      onClose={props.onClose}
      dataUiId={'call-with-chat-composite-people-pane'}
    >
      <Stack tokens={peoplePaneContainerTokens}>
        {inviteLink && (
          <DefaultButton text="Copy invite link" iconProps={{ iconName: 'Link' }} onClick={() => copy(inviteLink)} />
        )}
        {participantList}
      </Stack>
    </SidePane>
  );
};

/**
 * In a CallWithChat when a participant is removed, we must remove them from both
 * the call and the chat thread.
 */
const removeParticipantFromCallWithChat = async (
  callAdapter: CallAdapter,
  chatAdapter: ChatAdapter,
  participantId: string
): Promise<void> => {
  await callAdapter.removeParticipant(participantId);
  await chatAdapter.removeParticipant(participantId);
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
  callWithChatStrings: CallWithChatCompositeStrings,
  onRemoveParticipant: (userId: string) => Promise<void>,
  localParticipantUserId?: string
): IContextualMenuItem[] => {
  const menuItems: IContextualMenuItem[] = [];
  if (participant?.userId !== localParticipantUserId) {
    menuItems.push({
      key: 'remove',
      text: callWithChatStrings.removeMenuLabel,
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

/**
 * Convert IContextualMenuItem to _DrawerMenuItemProps
 * @param contextualMenu - IContextualMenuItem
 * @param onDrawerMenuItemClick - callback to call when converted DrawerMenuItem is clicked
 * @returns DrawerMenuItem
 */
const convertContextualMenuItemToDrawerMenuItem = (
  contextualMenu: IContextualMenuItem,
  onDrawerMenuItemClick: () => void
): _DrawerMenuItemProps => {
  return {
    itemKey: contextualMenu.key,
    onItemClick: () => {
      contextualMenu.onClick?.();
      onDrawerMenuItemClick();
    },
    iconProps: contextualMenu.iconProps,
    text: contextualMenu.text,
    disabled: contextualMenu.disabled
  };
};

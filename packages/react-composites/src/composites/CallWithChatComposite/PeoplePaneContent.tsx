// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, IContextualMenuItem, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import {
  ParticipantList,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  _DrawerMenuItemProps
} from '@internal/react-components';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
import { CallWithChatCompositeStrings } from '.';
import { CallAdapter } from '../CallComposite';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { ChatAdapter } from '../ChatComposite';
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

/**
 * @private
 */
export const PeoplePaneContent = (props: {
  inviteLink?: string;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  strings: CallWithChatCompositeStrings;
  setDrawerMenuItems: (_DrawerMenuItemProps) => void;
  mobileView?: boolean;
}): JSX.Element => {
  const { callAdapter, chatAdapter, inviteLink, onFetchParticipantMenuItems, setDrawerMenuItems, strings } = props;

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
    const onRemoveParticipant = async (participantId: string): Promise<void> =>
      removeParticipantFromCallWithChat(callAdapter, chatAdapter, participantId);
    return {
      ...participantListDefaultProps,
      // Passing undefined callback for mobile to avoid context menus for participants in ParticipantList are clicked
      onRemoveParticipant: props.mobileView ? undefined : onRemoveParticipant,
      // We want the drawer menu items to appear when participants in ParticipantList are clicked
      onParticipantClick: props.mobileView ? setDrawerMenuItemsForParticipant : undefined
    };
  }, [participantListDefaultProps, props.mobileView, setDrawerMenuItemsForParticipant, callAdapter, chatAdapter]);

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
    () =>
      concatStyleSets(copyLinkButtonStyles, {
        root: {
          minHeight: props.mobileView ? '3rem' : '2.5rem',
          borderRadius: props.mobileView ? theme.effects.roundedCorner6 : theme.effects.roundedCorner4
        }
      }),
    [props.mobileView, theme.effects.roundedCorner6, theme.effects.roundedCorner4]
  );

  if (props.mobileView) {
    return (
      <Stack verticalFill styles={peoplePaneContainerStyle} tokens={peoplePaneContainerTokens}>
        <Stack.Item grow styles={participantListContainerStyles}>
          {participantList}
        </Stack.Item>
        {inviteLink && (
          <Stack.Item styles={copyLinkButtonContainerStyles}>
            <PrimaryButton
              onClick={() => copy(inviteLink)}
              styles={copyLinkButtonStylesThemed}
              onRenderIcon={() => <LinkIconTrampoline />}
              text={strings.copyInviteLinkButtonLabel}
            />
          </Stack.Item>
        )}
      </Stack>
    );
  }
  return (
    <Stack tokens={peoplePaneContainerTokens}>
      {inviteLink && (
        <Stack styles={copyLinkButtonStackStyles}>
          <DefaultButton
            text={strings.copyInviteLinkButtonLabel}
            onRenderIcon={() => <LinkIconTrampoline />}
            onClick={() => copy(inviteLink)}
            styles={copyLinkButtonStylesThemed}
          />
        </Stack>
      )}
      {participantList}
    </Stack>
  );
};

const LinkIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(call-with-chat-composite)
  return <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />;

  // Return _something_ in stable builds to satisfy build system
  return <CallWithChatCompositeIcon iconName="ControlButtonEndCall" style={linkIconStyles} />;
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
 * @param contextualMenu - IContextualMenuItem to convert
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuItem, Stack } from '@fluentui/react';
import {
  ParticipantList,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  _DrawerMenuItemProps
} from '@internal/react-components';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallWithChatCompositeStrings } from '../CallWithChatComposite';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
import { participantListContainerStyles, peoplePaneContainerStyle } from './styles/PeoplePaneContent.styles';
import { convertContextualMenuItemToDrawerMenuItem } from '../CallWithChatComposite/ConvertContextualMenuItemToDrawerMenuItem';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallCompositeStrings } from '../CallComposite';
import { AddPeopleButton } from './AddPeopleButton';
/* @conditional-compile-remove(PSTN-calls) */
import { CommunicationIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';

/**
 * @private
 */
export const PeoplePaneContent = (props: {
  inviteLink?: string;
  onRemoveParticipant: (participantId: string) => void;
  /* @conditional-compile-remove(PSTN-calls) */
  onAddParticipant: (participant: CommunicationIdentifier, options?: AddPhoneNumberOptions) => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  strings: CallWithChatCompositeStrings | /* @conditional-compile-remove(one-to-n-calling) */ CallCompositeStrings;
  setDrawerMenuItems: (_DrawerMenuItemProps) => void;
  mobileView?: boolean;
  /* @conditional-compile-remove(PSTN-calls) */
  alternateCallerId?: string;
}): JSX.Element => {
  const { inviteLink, onFetchParticipantMenuItems, setDrawerMenuItems, strings, onRemoveParticipant } = props;
  const participantListDefaultProps = usePropsFor(ParticipantList);
  const disableRemoveButton = !hasRemoveParticipantsPermissionTrampoline();
  const setDrawerMenuItemsForParticipant: (participant?: ParticipantListParticipant) => void = useMemo(() => {
    return (participant?: ParticipantListParticipant) => {
      if (participant) {
        let contextualMenuItems: IContextualMenuItem[] = createDefaultContextualMenuItems(
          participant,
          strings,
          participantListDefaultProps.onRemoveParticipant,
          participantListDefaultProps.myUserId,
          disableRemoveButton
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
    disableRemoveButton,
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
      onFetchParticipantMenuItems={props.mobileView ? undefined : props.onFetchParticipantMenuItems}
      title={props.strings.peoplePaneSubTitle}
    />
  );

  if (props.mobileView) {
    return (
      <Stack verticalFill styles={peoplePaneContainerStyle} tokens={peoplePaneContainerTokens}>
        <Stack.Item grow styles={participantListContainerStyles}>
          {participantList}
        </Stack.Item>

        <AddPeopleButton
          inviteLink={inviteLink}
          mobileView={props.mobileView}
          participantList={participantList}
          strings={strings}
          /* @conditional-compile-remove(PSTN-calls) */
          onAddParticipant={props.onAddParticipant}
          /* @conditional-compile-remove(PSTN-calls) */
          alternateCallerId={props.alternateCallerId}
        />
      </Stack>
    );
  }

  return (
    <AddPeopleButton
      inviteLink={inviteLink}
      mobileView={props.mobileView}
      participantList={participantList}
      strings={strings}
      /* @conditional-compile-remove(PSTN-calls) */
      onAddParticipant={props.onAddParticipant}
      /* @conditional-compile-remove(PSTN-calls) */
      alternateCallerId={props.alternateCallerId}
    />
  );
};

/**
 * Create default contextual menu items for particant
 * @param participant - participant to create contextual menu items for
 * @param strings - localized strings for menu item text
 * @param onRemoveParticipant - callback to remove participant
 * @param localParticipantUserId - Local participant user id
 * @returns - IContextualMenuItem[]
 */
const createDefaultContextualMenuItems = (
  participant: ParticipantListParticipant,
  strings: CallWithChatCompositeStrings | /* @conditional-compile-remove(one-to-n-calling) */ CallCompositeStrings,
  onRemoveParticipant: (userId: string) => Promise<void>,
  localParticipantUserId?: string,
  disableRemoveButton?: boolean
): IContextualMenuItem[] => {
  let disabled = !participant.isRemovable;
  if (disableRemoveButton) {
    disabled = disabled || disableRemoveButton;
  }
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
      disabled: disabled
    });
  }
  return menuItems;
};

/**
 * @private
 */
const hasRemoveParticipantsPermissionTrampoline = (): boolean => {
  /* @conditional-compile-remove(rooms) */
  return _usePermissions().removeParticipantButton;
  // Return true if stable.
  return true;
};

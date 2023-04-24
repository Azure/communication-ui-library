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
import React, { useCallback, useMemo } from 'react';
import { CallWithChatCompositeStrings } from '../CallWithChatComposite';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
import { participantListContainerStyles, peoplePaneContainerStyle } from './styles/PeoplePaneContent.styles';
import { convertContextualMenuItemToDrawerMenuItem } from './ConvertContextualMenuItemToDrawerMenuItem';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { CallCompositeStrings } from '../CallComposite';
import { AddPeopleButton } from './AddPeopleButton';
/* @conditional-compile-remove(PSTN-calls) */
import { PhoneNumberIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { useAdapter } from '../CallComposite/adapter/CallAdapterProvider';
import { useLocale } from '../localization';

/**
 * @private
 */
export const PeoplePaneContent = (props: {
  inviteLink?: string;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  setDrawerMenuItems: (_DrawerMenuItemProps) => void;
  mobileView?: boolean;
}): JSX.Element => {
  const { inviteLink, onFetchParticipantMenuItems, setDrawerMenuItems } = props;
  const adapter = useAdapter();
  const localeStrings = useLocale();

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getStrings = () => {
    /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
    return localeStrings.strings.call;

    return localeStrings.strings.callWithChat;
  };
  const strings = getStrings();

  const removeParticipantFromCall = useCallback(
    async (participantId: string): Promise<void> => {
      await adapter.removeParticipant(participantId);
    },
    [adapter]
  );

  /* @conditional-compile-remove(PSTN-calls) */
  const addParticipantToCall = useCallback(
    async (participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions): Promise<void> => {
      await adapter.addParticipant(participant, options);
    },
    [adapter]
  );

  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = adapter.getState().alternateCallerId;

  const participantListDefaultProps = usePropsFor(ParticipantList);
  const removeButtonAllowed = hasRemoveParticipantsPermissionTrampoline();
  const setDrawerMenuItemsForParticipant: (participant?: ParticipantListParticipant) => void = useMemo(() => {
    return (participant?: ParticipantListParticipant) => {
      if (participant) {
        let contextualMenuItems: IContextualMenuItem[] = createDefaultContextualMenuItems(
          participant,
          strings,
          removeButtonAllowed && participant.isRemovable ? participantListDefaultProps.onRemoveParticipant : undefined,
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
    removeButtonAllowed,
    onFetchParticipantMenuItems,
    setDrawerMenuItems
  ]);

  const participantListProps: ParticipantListProps = useMemo(() => {
    const onRemoveAParticipant = async (participantId: string): Promise<void> =>
      removeParticipantFromCall(participantId);
    return {
      ...participantListDefaultProps,
      // Passing undefined callback for mobile to avoid context menus for participants in ParticipantList are clicked
      onRemoveParticipant: props.mobileView ? undefined : onRemoveAParticipant,
      // We want the drawer menu items to appear when participants in ParticipantList are clicked
      onParticipantClick: props.mobileView ? setDrawerMenuItemsForParticipant : undefined
    };
  }, [participantListDefaultProps, props.mobileView, setDrawerMenuItemsForParticipant, removeParticipantFromCall]);

  const participantList = (
    <ParticipantListWithHeading
      isMobile={props.mobileView}
      participantListProps={participantListProps}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      onFetchParticipantMenuItems={props.mobileView ? undefined : props.onFetchParticipantMenuItems}
      title={strings.peoplePaneSubTitle}
    />
  );

  if (props.mobileView) {
    return (
      <Stack
        verticalFill
        styles={peoplePaneContainerStyle}
        tokens={peoplePaneContainerTokens}
        data-ui-id="people-pane-content"
      >
        <Stack.Item grow styles={participantListContainerStyles}>
          {participantList}
        </Stack.Item>

        <AddPeopleButton
          inviteLink={inviteLink}
          mobileView={props.mobileView}
          participantList={participantList}
          strings={strings}
          /* @conditional-compile-remove(PSTN-calls) */
          onAddParticipant={addParticipantToCall}
          /* @conditional-compile-remove(PSTN-calls) */
          alternateCallerId={alternateCallerId}
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
      onAddParticipant={addParticipantToCall}
      /* @conditional-compile-remove(PSTN-calls) */
      alternateCallerId={alternateCallerId}
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
  strings:
    | CallWithChatCompositeStrings
    | /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */ CallCompositeStrings,
  onRemoveParticipant?: (userId: string) => Promise<void>,
  localParticipantUserId?: string
): IContextualMenuItem[] => {
  const menuItems: IContextualMenuItem[] = [];
  if (onRemoveParticipant && participant?.userId !== localParticipantUserId) {
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
      }
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

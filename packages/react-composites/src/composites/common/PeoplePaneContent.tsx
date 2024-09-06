// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IContextualMenuItem, IContextualMenuProps, Stack } from '@fluentui/react';
import {
  ParticipantList,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  _DrawerMenuItemProps
} from '@internal/react-components';
import React, { useCallback, useMemo } from 'react';
import { CallWithChatCompositeStrings } from '../CallWithChatComposite';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
import { participantListContainerStyles, peoplePaneContainerStyle } from './styles/PeoplePaneContent.styles';
import { convertContextualMenuItemToDrawerMenuItem } from './ConvertContextualMenuItemToDrawerMenuItem';
import { CommonCallAdapter } from '../CallComposite';
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
  setDrawerMenuItems: (drawerMenuItems: _DrawerMenuItemProps[]) => void;
  setParticipantActioned?: (userId: string) => void;
  mobileView?: boolean;
  participantListHeadingMoreButtonProps?: IContextualMenuProps;
  pinnedParticipants?: string[];
}): JSX.Element => {
  const {
    inviteLink,
    onFetchParticipantMenuItems,
    setDrawerMenuItems,
    setParticipantActioned,
    participantListHeadingMoreButtonProps
  } = props;
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
  const removeButtonAllowed = canRemoveParticipants(adapter);
  const setDrawerMenuItemsForParticipant: (participant?: ParticipantListParticipant) => void = useMemo(() => {
    return (participant?: ParticipantListParticipant) => {
      if (participant) {
        setParticipantActioned?.(participant.userId);
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
    setDrawerMenuItems,
    setParticipantActioned
  ]);

  const setDrawerMenuItemsForParticipantListHeadingMoreButton = useMemo(() => {
    const drawerMenuItems = participantListHeadingMoreButtonProps?.items.map((contextualMenu: IContextualMenuItem) =>
      convertContextualMenuItemToDrawerMenuItem(contextualMenu, () => setDrawerMenuItems([]))
    );
    return drawerMenuItems && drawerMenuItems.length > 0 ? () => setDrawerMenuItems(drawerMenuItems) : undefined;
  }, [participantListHeadingMoreButtonProps?.items, setDrawerMenuItems]);

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
      onFetchParticipantMenuItems={props.mobileView ? undefined : onFetchParticipantMenuItems}
      title={strings.peoplePaneSubTitle}
      headingMoreButtonAriaLabel={localeStrings.strings.call.peoplePaneMoreButtonAriaLabel}
      onClickHeadingMoreButton={props.mobileView ? setDrawerMenuItemsForParticipantListHeadingMoreButton : undefined}
      headingMoreButtonMenuProps={props.participantListHeadingMoreButtonProps}
      pinnedParticipants={props.pinnedParticipants}
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
        iconName: 'ContextMenuRemoveParticipant',
        styles: { root: { lineHeight: 0 } }
      },
      'data-ui-id': 'participant-list-remove-participant-button'
    });
  }
  return menuItems;
};

const canRemoveParticipants = (adapter: CommonCallAdapter): boolean => {
  // TODO: We should be using the removeParticipant capability here but there is an SDK bug for Rooms where a
  // Presenter's removeParticipant capability is {isPresent: false, reason: 'CapabilityNotApplicableForTheCallType'}.
  // But a Presenter in Rooms should be able to remove participants according to the following documentation
  // https://learn.microsoft.com/en-us/azure/communication-services/concepts/rooms/room-concept#predefined-participant-roles-and-permissions
  const role = adapter.getState().call?.role;
  const canRemove = role === 'Presenter' || role === 'Unknown' || role === undefined;
  return canRemove;
};

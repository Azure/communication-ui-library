// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { IContextualMenuProps, IContextualMenuStyles } from '@fluentui/react';
import { concatStyleSets, DefaultButton, IContextualMenuItem, PrimaryButton, Stack, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { Dialpad20Regular, Link20Regular, PersonAdd20Regular } from '@fluentui/react-icons';
import {
  ParticipantList,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  _DrawerMenuItemProps
} from '@internal/react-components';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { _DrawerMenu as DrawerMenu, _DrawerSurface } from '@internal/react-components';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { DialpadModal, DialpadModalStrings } from './components/DialpadModal';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { useState } from 'react';
import { CallWithChatCompositeStrings } from '.';
import { CallAdapter } from '../CallComposite';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { CallWithChatCompositeIcon } from '../common/icons';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { drawerContainerStyles } from './styles/CallWithChatCompositeStyles';
import {
  copyLinkButtonStackStyles,
  copyLinkButtonContainerStyles,
  copyLinkButtonStyles,
  linkIconStyles,
  participantListContainerStyles,
  peoplePaneContainerStyle
} from './styles/PeoplePaneContent.styles';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallCompositeStrings } from '../CallComposite';

/**
 * @private
 */
export const PeoplePaneContent = (props: {
  inviteLink?: string;
  onRemoveParticipant: (participantId: string) => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  strings: CallWithChatCompositeStrings | /* @conditional-compile-remove(one-to-n-calling) */ CallCompositeStrings;
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
    () =>
      concatStyleSets(copyLinkButtonStyles, {
        root: {
          minHeight: props.mobileView ? '3rem' : '2.5rem',
          borderRadius: props.mobileView ? theme.effects.roundedCorner6 : theme.effects.roundedCorner4
        }
      }),
    [props.mobileView, theme.effects.roundedCorner6, theme.effects.roundedCorner4]
  );

  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const dialpadModalStrings: DialpadModalStrings = useMemo(
    () => ({
      dialpadModalAriaLabel: strings.dialpadModalAriaLabel,
      DialpadModalTitle: strings.DialpadModalTitle,
      closeModalButtonAriaLabel: strings.closeModalButtonAriaLabel,
      callButtonLabel: strings.callButtonLabel
    }),
    [strings]
  );

  /* @conditional-compile-remove(PeoplePaneDropdown) */
  // desktop add people button with context menu
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const [isModalOpen, setIsModalOpen] = useState(false);
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const menuStyleThemed: Partial<IContextualMenuStyles> = useMemo(
    () => ({
      root: {
        borderRadius: theme.effects.roundedCorner6
      },

      title: {
        background: 'initial',
        paddingLeft: '.5rem',
        fontWeight: 600,
        fontSize: '0.875rem'
      },
      list: {
        background: 'initial',
        fontWeight: 600,
        fontSize: '0.875rem'
      }
    }),
    [theme.effects.roundedCorner6]
  );
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const defaultMenuProps = useMemo((): IContextualMenuProps => {
    const menuProps: IContextualMenuProps = {
      styles: menuStyleThemed,
      items: [],
      useTargetWidth: true,
      calloutProps: {
        // Disable dismiss on resize to work around a couple Fluent UI bugs
        // - The Callout is dismissed whenever *any child of window (inclusive)* is resized. In practice, this
        //   happens when we change the VideoGallery layout, or even when the video stream element is internally resized
        //   by the headless SDK.
        // - There is a `preventDismissOnEvent` prop that we could theoretically use to only dismiss when the target of
        //   of the 'resize' event is the window itself. But experimentation shows that setting that prop doesn't
        //   deterministically avoid dismissal.
        //
        // A side effect of this workaround is that the context menu stays open when window is resized, and may
        // get detached from original target visually. That bug is preferable to the bug when this value is not set -
        // The Callout (frequently) gets dismissed automatically.
        preventDismissOnResize: true
      }
    };

    if (inviteLink) {
      menuProps.items.push({
        key: 'InviteLinkKey',
        name: strings.copyInviteLinkButtonLabel,
        title: strings.copyInviteLinkButtonLabel,
        text: strings.copyInviteLinkButtonLabel,
        onRenderIcon: () => <Link20Regular style={linkIconStyles} />,
        itemProps: { styles: copyLinkButtonStylesThemed },
        iconProps: { iconName: 'Link' },
        onClick: () => copy(inviteLink)
      });
    }

    menuProps.items.push({
      key: 'DialpadKey',
      name: strings.openDialpadButtonLabel,
      title: strings.openDialpadButtonLabel,
      text: strings.openDialpadButtonLabel,
      onRenderIcon: () => <Dialpad20Regular style={linkIconStyles} />,
      itemProps: { styles: copyLinkButtonStylesThemed },
      iconProps: { iconName: 'Dialpad' },
      onClick: () => setIsModalOpen(true)
    });

    return menuProps;
  }, [
    strings.copyInviteLinkButtonLabel,
    strings.openDialpadButtonLabel,
    copyLinkButtonStylesThemed,
    inviteLink,
    menuStyleThemed
  ]);
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const hideModal = (): void => {
    setIsModalOpen(false);
  };
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  //mobile add people button with botten sheet drawers
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const [addPeopleDrawerMenuItems, setAddPeopleDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const setDrawerMenuItemsForAddPeople: () => void = useMemo(() => {
    return () => {
      const drawerMenuItems = defaultMenuProps.items.map((contextualMenu: IContextualMenuItem) =>
        convertContextualMenuItemToDrawerMenuItem(contextualMenu, () => setAddPeopleDrawerMenuItems([]))
      );
      setAddPeopleDrawerMenuItems(drawerMenuItems);
    };
  }, [defaultMenuProps, setAddPeopleDrawerMenuItems]);

  // for conditional compile
  const mobileViewAddPeopleButton = (inviteLink?: string): JSX.Element => {
    /* @conditional-compile-remove(PeoplePaneDropdown) */
    return (
      <Stack>
        <Stack.Item styles={copyLinkButtonContainerStyles}>
          <PrimaryButton
            onClick={setDrawerMenuItemsForAddPeople}
            styles={copyLinkButtonStylesThemed}
            onRenderIcon={() => <PersonAdd20Regular />}
            text={strings.addPeopleButtonLabel}
          />
        </Stack.Item>

        {addPeopleDrawerMenuItems.length > 0 && (
          <Stack styles={drawerContainerStyles}>
            <DrawerMenu onLightDismiss={() => setAddPeopleDrawerMenuItems([])} items={addPeopleDrawerMenuItems} />
          </Stack>
        )}

        <DialpadModal isMobile strings={dialpadModalStrings} isModalOpen={isModalOpen} hideModal={hideModal} />
      </Stack>
    );

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
    /* @conditional-compile-remove(PeoplePaneDropdown) */
    return (
      <Stack>
        <DialpadModal isMobile={false} strings={dialpadModalStrings} isModalOpen={isModalOpen} hideModal={hideModal} />
        <Stack tokens={peoplePaneContainerTokens}>
          <Stack styles={copyLinkButtonStackStyles}>
            <DefaultButton
              onRenderIcon={() => <CallWithChatCompositeIcon iconName="AddPerson" />}
              text={strings.addPeopleButtonLabel}
              menuProps={defaultMenuProps}
              styles={copyLinkButtonStylesThemed}
            />
          </Stack>

          {participantList}
        </Stack>
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
 * @param strings - localized strings for menu item text
 * @param onRemoveParticipant - callback to remove participant
 * @param localParticipantUserId - Local participant user id
 * @returns - IContextualMenuItem[]
 */
const createDefaultContextualMenuItems = (
  participant: ParticipantListParticipant,
  strings: CallWithChatCompositeStrings | /* @conditional-compile-remove(one-to-n-calling) */ CallCompositeStrings,
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

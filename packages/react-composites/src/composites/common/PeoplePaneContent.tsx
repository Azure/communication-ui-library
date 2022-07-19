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
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { IContextualMenuProps, IContextualMenuStyles } from '@fluentui/react';
import {
  ParticipantList,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  _DrawerMenuItemProps
} from '@internal/react-components';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { _DrawerMenu, _DrawerSurface } from '@internal/react-components';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { useState } from 'react';
import { CallAdapter } from '../CallComposite';
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
/* @conditional-compile-remove(one-to-n-calling) */
import { CallCompositeStrings } from '../CallComposite';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { themedMenuStyle } from './styles/PeoplePaneContent.styles';
import { themedCopyLinkButtonStyles } from './styles/PeoplePaneContent.styles';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { drawerContainerStyles } from '../CallWithChatComposite/styles/CallWithChatCompositeStyles';
/* @conditional-compile-remove(PeoplePaneDropdown) */
import { PreparedDialpad } from '../CallWithChatComposite/components/PreparedDialpad';

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
    (): IButtonStyles => concatStyleSets(copyLinkButtonStyles, themedCopyLinkButtonStyles(props.mobileView, theme)),
    [props.mobileView, theme]
  );

  /* @conditional-compile-remove(PeoplePaneDropdown) */
  // desktop add people button with context menu
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const [showDialpad, setShowDialpad] = useState(false);
  /* @conditional-compile-remove(PeoplePaneDropdown) */
  const menuStyleThemed: Partial<IContextualMenuStyles> = useMemo(() => themedMenuStyle(theme), [theme]);
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
        text: strings.copyInviteLinkButtonLabel,
        itemProps: { styles: copyLinkButtonStylesThemed },
        iconProps: { iconName: 'Link', style: linkIconStyles },
        onClick: () => copy(inviteLink)
      });
    }

    menuProps.items.push({
      key: 'DialpadKey',
      text: strings.openDialpadButtonLabel,
      itemProps: { styles: copyLinkButtonStylesThemed },
      iconProps: { iconName: 'Dialpad', style: linkIconStyles },
      onClick: () => setShowDialpad(true)
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
  const onDismissDialpad = (): void => {
    setShowDialpad(false);
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
            onRenderIcon={() => <CallWithChatCompositeIcon iconName="PeoplePaneAddPerson" />}
            text={strings.peoplePaneAddPeopleButtonLabel}
          />
        </Stack.Item>

        {addPeopleDrawerMenuItems.length > 0 && (
          <Stack styles={drawerContainerStyles}>
            <_DrawerMenu onLightDismiss={() => setAddPeopleDrawerMenuItems([])} items={addPeopleDrawerMenuItems} />
          </Stack>
        )}

        <PreparedDialpad isMobile strings={strings} showDialpad={showDialpad} onDismissDialpad={onDismissDialpad} />
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
        <PreparedDialpad
          isMobile={false}
          strings={strings}
          showDialpad={showDialpad}
          onDismissDialpad={onDismissDialpad}
        />
        <Stack tokens={peoplePaneContainerTokens}>
          <Stack styles={copyLinkButtonStackStyles}>
            <DefaultButton
              onRenderIcon={() => <CallWithChatCompositeIcon iconName="PeoplePaneAddPerson" />}
              text={strings.peoplePaneAddPeopleButtonLabel}
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

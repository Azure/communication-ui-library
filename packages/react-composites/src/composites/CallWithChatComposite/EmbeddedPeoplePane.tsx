// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  ContextualMenu,
  DefaultButton,
  IContextualMenuItem,
  IDragOptions,
  Modal,
  PrimaryButton,
  Stack
} from '@fluentui/react';
import {
  ParticipantList,
  ParticipantListParticipant,
  ParticipantListProps,
  ParticipantMenuItemsCallback,
  useTheme,
  _DrawerMenu,
  _DrawerMenuItemProps
} from '@internal/react-components';
import copy from 'copy-to-clipboard';
import React, { useMemo, useState } from 'react';
import { CallWithChatCompositeStrings } from '.';
import { CallAdapter } from '../CallComposite';
import { LocalAndRemotePIP } from '../CallComposite/components/LocalAndRemotePIP';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { useSelector } from '../CallComposite/hooks/useSelector';
import { localAndRemotePIPSelector } from '../CallComposite/selectors/localAndRemotePIPSelector';
import { ChatAdapter } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { CallWithChatCompositeIcon } from '../common/icons';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { MobilePane } from './MobilePane';
import { SidePane } from './SidePane';
import { drawerContainerStyles } from './styles/CallWithChatCompositeStyles';
import {
  copyLinkButtonContainerStyles,
  copyLinkButtonStyles,
  copyLinkDesktopButtonStyles,
  linkIconStyles,
  modalStyle,
  participantListContainerStyles,
  peoplePaneContainerStyle
} from './styles/EmbeddedPeoplePane.styles';

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
  modalLayerHostId: string;
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
      isMobile={props.mobileView}
      participantListProps={participantListProps}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
      title={callWithChatStrings.peoplePaneSubTitle}
    />
  );

  const pictureInPictureProps = useSelector(localAndRemotePIPSelector);
  const pictureInPictureHandlers = useHandlers(LocalAndRemotePIP);

  const localAndRemotePIP = useMemo(
    () => <LocalAndRemotePIP {...pictureInPictureProps} {...pictureInPictureHandlers} />,
    [pictureInPictureProps, pictureInPictureHandlers]
  );

  const DRAG_OPTIONS: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    keepInBounds: true
  };

  const theme = useTheme();

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
          <Stack.Item grow styles={participantListContainerStyles}>
            {participantList}
          </Stack.Item>
          {inviteLink && (
            <Stack.Item styles={copyLinkButtonContainerStyles}>
              <PrimaryButton
                onClick={() => copy(inviteLink)}
                styles={copyLinkButtonStyles}
                onRenderIcon={() => <LinkIconTrampoline />}
                text={callWithChatStrings.copyInviteLinkButtonLabel}
              />
            </Stack.Item>
          )}
          <Modal
            isOpen={true}
            isModeless={true}
            dragOptions={DRAG_OPTIONS}
            styles={modalStyle(theme)}
            layerProps={{ hostId: props.modalLayerHostId }}
          >
            {
              // Only render LocalAndRemotePIP when this component is NOT hidden because VideoGallery needs to have
              // possession of the dominant remote participant video stream
              !props.hidden && localAndRemotePIP
            }
          </Modal>
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
          <DefaultButton
            text={callWithChatStrings.copyInviteLinkButtonLabel}
            iconProps={{ iconName: 'Link' }}
            onClick={() => copy(inviteLink)}
            styles={copyLinkDesktopButtonStyles}
          />
        )}
        {participantList}
      </Stack>
    </SidePane>
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

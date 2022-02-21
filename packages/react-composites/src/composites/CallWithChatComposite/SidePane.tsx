// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useMemo, useState } from 'react';
import { ChatComposite, ChatAdapter, ChatCompositeProps } from '../ChatComposite';
import { CommandBarButton, DefaultButton, PartialTheme, Theme, Stack, IStackStyles } from '@fluentui/react';
import {
  sidePaneContainerHiddenStyles,
  sidePaneContainerStyles,
  sidePaneContainerTokens,
  sidePaneHeaderStyles,
  peoplePaneContainerTokens,
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../common/styles/ParticipantContainer.styles';
import {
  ParticipantList,
  useTheme,
  _DrawerMenu,
  _DrawerMenuItemProps,
  ParticipantListParticipant,
  ParticipantListProps
} from '@internal/react-components';
import copy from 'copy-to-clipboard';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
import { CallAdapter } from '../CallComposite';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { ParticipantListWithHeading } from '../common/ParticipantContainer';
import { MobilePane } from './MobilePane';
import { useLocale } from '../localization';

const SidePane = (props: {
  headingText: string;
  children: React.ReactNode;
  onClose: () => void;
  hidden: boolean;
  dataUiId: string;
}): JSX.Element => {
  // We hide the side pane instead of not rendering the entire pane to persist certain elements
  // between renders. An example of this is composing a chat message - a chat message that has been
  // typed but not sent should not be lost if the side panel is closed and then reopened.
  const sidePaneStyles = props.hidden ? sidePaneContainerHiddenStyles : sidePaneContainerStyles;
  const theme = useTheme();
  const sidePaneCloseButtonStyles = {
    icon: { color: theme.palette.neutralSecondary },
    iconHovered: { color: theme.palette.neutralSecondary },
    iconPressed: { color: theme.palette.neutralSecondary }
  };
  return (
    <Stack.Item disableShrink verticalFill styles={sidePaneStyles} tokens={sidePaneContainerTokens}>
      <Stack verticalFill data-ui-id={props.dataUiId}>
        <Stack horizontal horizontalAlign="space-between" styles={sidePaneHeaderStyles}>
          <Stack.Item>{props.headingText}</Stack.Item>
          <CommandBarButton
            styles={sidePaneCloseButtonStyles}
            iconProps={{ iconName: 'cancel' }}
            onClick={props.onClose}
          />
        </Stack>
        <Stack.Item verticalFill grow styles={paneBodyContainer}>
          <Stack horizontal styles={scrollableContainer}>
            <Stack.Item verticalFill styles={scrollableContainerContents}>
              {props.children}
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
    </Stack.Item>
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
 * @private
 */
export const EmbeddedPeoplePane = (props: {
  inviteLink?: string;
  onClose: () => void;
  hidden: boolean;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onChatButtonClick: () => void;
  onPeopleButtonClick: () => void;
  mobileView?: boolean;
}): JSX.Element => {
  const { callAdapter, chatAdapter, inviteLink, mobileView } = props;
  const participantListDefaultProps = usePropsFor(ParticipantList);

  const locale = useLocale();

  const [menuItems, setMenuItems] = useState<_DrawerMenuItemProps[]>([]);

  const participantListProps: ParticipantListProps = useMemo(() => {
    const onRemoveParticipant = async (participantId: string): Promise<void> =>
      removeParticipantFromCallWithChat(callAdapter, chatAdapter, participantId);
    return {
      ...participantListDefaultProps,
      onRemoveParticipant: mobileView ? undefined : onRemoveParticipant
    };
  }, [participantListDefaultProps, callAdapter, chatAdapter]);

  const participantList = (
    <ParticipantListWithHeading
      participantListProps={participantListProps}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
      title={locale.strings.callWithChat.peoplePaneSubTitle}
      onParticipantClick={(participant?: ParticipantListParticipant) => {
        if (participant?.userId !== participantListProps.myUserId) {
          setMenuItems([
            {
              itemKey: 'remove',
              text: locale.component.strings.participantItem.removeButtonLabel,
              onItemClick: () => {
                if (participant?.userId) {
                  participantListDefaultProps.onRemoveParticipant?.(participant?.userId);
                }
                setMenuItems([]);
              },
              iconProps: {
                iconName: 'UserRemove'
              }
            }
          ]);
        }
      }}
    />
  );

  if (mobileView) {
    return (
      <MobilePane
        hidden={props.hidden}
        dataUiId={'call-with-chat-composite-people-pane'}
        onClose={props.onClose}
        activeTab="people"
        onChatButtonClicked={props.onChatButtonClick}
        onPeopleButtonClicked={props.onPeopleButtonClick}
      >
        {participantList}
        {menuItems.length > 0 && (
          <Stack styles={drawerContainerStyles}>
            <_DrawerMenu onLightDismiss={() => setMenuItems([])} items={menuItems} />
          </Stack>
        )}
      </MobilePane>
    );
  }

  return (
    <SidePane
      hidden={props.hidden}
      headingText={locale.strings.callWithChat.peoplePaneTitle}
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

const drawerContainerStyles: IStackStyles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Any zIndex > 0 will work because this is the only absolutely
    // positioned element in the container.
    zIndex: 1
  }
};

/**
 * @private
 */
export const EmbeddedChatPane = (props: {
  chatCompositeProps: Partial<ChatCompositeProps>;
  chatAdapter: ChatAdapter;
  fluentTheme?: PartialTheme | Theme;
  hidden: boolean;
  onClose: () => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onChatButtonClick: () => void;
  onPeopleButtonClick: () => void;
  mobileView?: boolean;
}): JSX.Element => {
  const callWithChatStrings = useCallWithChatCompositeStrings();

  const chatComposite = (
    <ChatComposite
      {...props.chatCompositeProps}
      adapter={props.chatAdapter}
      fluentTheme={props.fluentTheme}
      options={{ topic: false, /* @conditional-compile-remove-from(stable) */ participantPane: false }}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
    />
  );

  if (props.mobileView) {
    return (
      <MobilePane
        hidden={props.hidden}
        dataUiId={'call-with-chat-composite-chat-pane'}
        onClose={props.onClose}
        activeTab="chat"
        onChatButtonClicked={props.onChatButtonClick}
        onPeopleButtonClicked={props.onPeopleButtonClick}
      >
        {chatComposite}
      </MobilePane>
    );
  }
  return (
    <SidePane
      hidden={props.hidden}
      headingText={callWithChatStrings.chatPaneTitle}
      onClose={props.onClose}
      dataUiId={'call-with-chat-composite-chat-pane'}
    >
      {chatComposite}
    </SidePane>
  );
};

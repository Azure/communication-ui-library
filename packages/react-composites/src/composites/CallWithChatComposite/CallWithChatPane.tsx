// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IStackStyles, IStackTokens, Stack } from '@fluentui/react';
import { ParticipantMenuItemsCallback, useTheme, _DrawerMenu, _DrawerMenuItemProps } from '@internal/react-components';
import React, { useMemo, useState } from 'react';
import { CallAdapter } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { ChatAdapter, ChatComposite, ChatCompositeProps } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import {
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../common/styles/ParticipantContainer.styles';
import { BasicHeader } from './BasicHeader';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { ModalLocalAndRemotePIP, ModalLocalAndRemotePIPStyles } from './ModalLocalAndRemotePIP';
import { PeoplePaneContent } from './PeoplePaneContent';
import { drawerContainerStyles } from './styles/CallWithChatCompositeStyles';
import { TabHeader } from './TabHeader';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingOptions } from '../ChatComposite';

/**
 * Pane that is used to store chat and people for CallWithChat composite
 * @private
 */
export const CallWithChatPane = (props: {
  chatCompositeProps: Partial<ChatCompositeProps>;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onClose: () => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  modalLayerHostId: string;
  activePane: CallWithChatPaneOption;
  mobileView?: boolean;
  inviteLink?: string;
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
}): JSX.Element => {
  const [drawerMenuItems, setDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);

  const hidden = props.activePane === 'none';
  const paneStyles = hidden ? hiddenStyles : props.mobileView ? availableSpaceStyles : sidePaneStyles;

  const callWithChatStrings = useCallWithChatCompositeStrings();
  const theme = useTheme();

  const header =
    props.activePane === 'none' ? null : props.mobileView ? (
      <TabHeader {...props} activeTab={props.activePane} />
    ) : (
      <BasicHeader
        {...props}
        headingText={
          props.activePane === 'chat' ? callWithChatStrings.chatPaneTitle : callWithChatStrings.peoplePaneTitle
        }
      />
    );

  const chatContent = (
    <ChatComposite
      {...props.chatCompositeProps}
      adapter={props.chatAdapter}
      fluentTheme={theme}
      options={{
        topic: false,
        /* @conditional-compile-remove(chat-composite-participant-pane) */
        participantPane: false,
        /* @conditional-compile-remove(file-sharing) */
        fileSharing: props.fileSharing
      }}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
    />
  );

  const peopleContent = (
    <CallAdapterProvider adapter={props.callAdapter}>
      <PeoplePaneContent {...props} setDrawerMenuItems={setDrawerMenuItems} strings={callWithChatStrings} />
    </CallAdapterProvider>
  );

  const pipStyles: ModalLocalAndRemotePIPStyles = useMemo(
    () => ({
      modal: {
        main: {
          borderRadius: theme.effects.roundedCorner4,
          boxShadow: theme.effects.elevation8,
          ...(theme.rtl ? { left: '1rem' } : { right: '1rem' })
        }
      }
    }),
    [theme.effects.roundedCorner4, theme.effects.elevation8, theme.rtl]
  );

  return (
    <Stack
      verticalFill
      grow
      styles={paneStyles}
      data-ui-id={
        props.activePane === 'chat' ? 'call-with-chat-composite-chat-pane' : 'call-with-chat-composite-people-pane'
      }
      tokens={props.mobileView ? {} : sidePaneTokens}
    >
      {header}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            <Stack styles={props.activePane === 'chat' ? availableSpaceStyles : hiddenStyles}>{chatContent}</Stack>
            <Stack styles={props.activePane === 'people' ? availableSpaceStyles : hiddenStyles}>{peopleContent}</Stack>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      {props.mobileView && (
        <ModalLocalAndRemotePIP
          callAdapter={props.callAdapter}
          modalLayerHostId={props.modalLayerHostId}
          hidden={hidden}
          styles={pipStyles}
        />
      )}
      {drawerMenuItems.length > 0 && (
        <Stack styles={drawerContainerStyles}>
          <_DrawerMenu onLightDismiss={() => setDrawerMenuItems([])} items={drawerMenuItems} />
        </Stack>
      )}
    </Stack>
  );
};

/**
 * Active tab option type for {@link CallWithChatPane} component
 * @private
 */
export type CallWithChatPaneOption = 'none' | 'chat' | 'people';

const hiddenStyles: IStackStyles = {
  root: {
    display: 'none'
  }
};

const sidePaneStyles: IStackStyles = {
  root: {
    height: '100%',
    padding: '0.5rem 0.25rem',
    maxWidth: '21.5rem'
  }
};

const availableSpaceStyles: IStackStyles = { root: { width: '100%', height: '100%' } };

const sidePaneTokens: IStackTokens = {
  childrenGap: '0.5rem'
};

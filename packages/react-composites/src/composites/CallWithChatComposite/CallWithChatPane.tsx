// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { Stack } from '@fluentui/react';
import {
  _DrawerMenu,
  _DrawerMenuItemProps,
  _useContainerHeight,
  _useContainerWidth,
  ParticipantMenuItemsCallback,
  useTheme
} from '@internal/react-components';
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
import { SidePaneHeader } from '../common/SidePaneHeader';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { ModalLocalAndRemotePIP } from '../common/ModalLocalAndRemotePIP';
import { PeoplePaneContent } from '../common/PeoplePaneContent';
import { drawerContainerStyles } from './styles/CallWithChatCompositeStyles';
import { TabHeader } from '../common/TabHeader';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingOptions } from '../ChatComposite';
import { _ICoordinates } from '@internal/react-components';
import { _pxToRem } from '@internal/acs-ui-common';
import { getPipStyles } from '../common/styles/ModalLocalAndRemotePIP.styles';
import { useMinMaxDragPosition } from '../common/utils';
import { availableSpaceStyles, hiddenStyles, sidePaneStyles, sidePaneTokens } from '../common/styles/Pane.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { PhoneNumberIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { CallWithChatControlOptions } from './CallWithChatComposite';
import { isDisabled } from '../CallComposite/utils';

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
  onChatButtonClicked?: () => void;
  onPeopleButtonClicked?: () => void;
  modalLayerHostId: string;
  activePane: CallWithChatPaneOption;
  mobileView?: boolean;
  inviteLink?: string;
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
  rtl?: boolean;
  callControls?: CallWithChatControlOptions;
}): JSX.Element => {
  const [drawerMenuItems, setDrawerMenuItems] = useState<_DrawerMenuItemProps[]>([]);

  const hidden = props.activePane === 'none';
  const paneStyles = hidden ? hiddenStyles : props.mobileView ? availableSpaceStyles : sidePaneStyles;

  const callWithChatStrings = useCallWithChatCompositeStrings();
  const theme = useTheme();

  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = props.callAdapter.getState().alternateCallerId;

  const header =
    props.activePane === 'none' ? null : props.mobileView ? (
      <TabHeader
        {...props}
        strings={callWithChatStrings}
        activeTab={props.activePane}
        disableChatButton={isDisabled(props.callControls?.chatButton)}
        disablePeopleButton={isDisabled(props.callControls?.peopleButton)}
      />
    ) : (
      <SidePaneHeader
        {...props}
        strings={callWithChatStrings}
        headingText={
          props.activePane === 'chat'
            ? callWithChatStrings.chatPaneTitle
            : props.activePane === 'people'
            ? callWithChatStrings.peoplePaneTitle
            : ''
        }
      />
    );

  const chatContent = useMemo(
    () => (
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
    ),
    [props.chatCompositeProps, props.chatAdapter, props.fileSharing, props.onFetchAvatarPersonaData, theme]
  );

  const peopleContent = useMemo(() => {
    /**
     * In a CallWithChat when a participant is removed, we must remove them from both
     * the call and the chat thread.
     */
    const removeParticipantFromCallWithChat = async (participantId: string): Promise<void> => {
      await props.callAdapter.removeParticipant(participantId);
      await props.chatAdapter.removeParticipant(participantId);
    };

    /* @conditional-compile-remove(PSTN-calls) */
    const addParticipantToCall = async (
      participant: PhoneNumberIdentifier,
      options?: AddPhoneNumberOptions
    ): Promise<void> => {
      await props.callAdapter.addParticipant(participant, options);
    };

    return (
      <CallAdapterProvider adapter={props.callAdapter}>
        <PeoplePaneContent
          {...props}
          onRemoveParticipant={removeParticipantFromCallWithChat}
          setDrawerMenuItems={setDrawerMenuItems}
          strings={callWithChatStrings}
          /* @conditional-compile-remove(PSTN-calls) */
          onAddParticipant={addParticipantToCall}
          /* @conditional-compile-remove(PSTN-calls) */
          alternateCallerId={alternateCallerId}
        />
      </CallAdapterProvider>
    );
  }, [alternateCallerId, callWithChatStrings, props]);

  const minMaxDragPosition = useMinMaxDragPosition(props.modalLayerHostId, props.rtl);

  const pipStyles = useMemo(() => getPipStyles(theme), [theme]);

  const dataUiId =
    props.activePane === 'chat'
      ? 'call-with-chat-composite-chat-pane'
      : props.activePane === 'people'
      ? 'call-with-chat-composite-people-pane'
      : '';

  return (
    <Stack verticalFill grow styles={paneStyles} data-ui-id={dataUiId} tokens={props.mobileView ? {} : sidePaneTokens}>
      {header}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            {props.activePane === 'chat' && <Stack styles={availableSpaceStyles}>{chatContent}</Stack>}
            {props.activePane === 'people' && <Stack styles={availableSpaceStyles}>{peopleContent}</Stack>}
          </Stack.Item>
        </Stack>
      </Stack.Item>
      {props.mobileView && (
        <CallAdapterProvider adapter={props.callAdapter}>
          <ModalLocalAndRemotePIP
            modalLayerHostId={props.modalLayerHostId}
            hidden={hidden}
            styles={pipStyles}
            minDragPosition={minMaxDragPosition.minDragPosition}
            maxDragPosition={minMaxDragPosition.maxDragPosition}
          />
        </CallAdapterProvider>
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

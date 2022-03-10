// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { IStackStyles, Stack } from '@fluentui/react';
import { ParticipantMenuItemsCallback, useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
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
import { PeoplePaneContent } from './PeoplePaneContent';
import { TabHeader } from './TabHeader';
import { LocalAndRemotePIPHooked, WithLocalAndRemotePIPStyles } from './WithLocalAndRemotePIP';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingOptions } from '../ChatComposite';

/**
 * @private
 */
export const Pane = (props: {
  chatCompositeProps: Partial<ChatCompositeProps>;
  callAdapter: CallAdapter;
  chatAdapter: ChatAdapter;
  onClose: () => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  modalLayerHostId: string;
  activePane: 'chat' | 'people' | 'none';
  mobileView?: boolean;
  inviteLink?: string;
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
}): JSX.Element => {
  const hidden = props.activePane === 'none';
  const paneStyles = hidden ? hiddenStyles : props.mobileView ? mobilePaneStyles : sidePaneStyles;

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

  const content =
    props.activePane === 'chat' ? (
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
    ) : props.activePane === 'people' ? (
      <CallAdapterProvider adapter={props.callAdapter}>
        <PeoplePaneContent {...props} strings={callWithChatStrings} />
      </CallAdapterProvider>
    ) : null;

  const pipStyles: WithLocalAndRemotePIPStyles = useMemo(
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
    >
      {header}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            {content}
          </Stack.Item>
        </Stack>
      </Stack.Item>
      {props.mobileView && (
        <LocalAndRemotePIPHooked
          callAdapter={props.callAdapter}
          modalLayerHostId={props.modalLayerHostId}
          hidden={props.activePane === 'none'}
          styles={pipStyles}
        />
      )}
    </Stack>
  );
};

/**
 * @private
 */
export const hiddenStyles: IStackStyles = {
  root: {
    display: 'none'
  }
};

/**
 * @private
 */
export const sidePaneStyles: IStackStyles = {
  root: {
    height: '100%',
    padding: '0.5rem 0.25rem',
    width: '21.5rem'
  }
};

/**
 * @private
 */
export const mobilePaneStyles: IStackStyles = { root: { width: '100%', height: '100%' } };

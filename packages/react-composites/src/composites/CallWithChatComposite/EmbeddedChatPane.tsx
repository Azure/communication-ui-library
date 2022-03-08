// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PartialTheme, Theme, useTheme } from '@fluentui/react';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { ChatAdapter, ChatComposite, ChatCompositeProps } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { MobilePaneWithLocalAndRemotePIP, MobilePaneWithLocalAndRemotePIPStyles } from './MobilePane';
import { SidePane } from './SidePane';

/**
 * @private
 */
export const EmbeddedChatPane = (props: {
  chatCompositeProps: Partial<ChatCompositeProps>;
  chatAdapter: ChatAdapter;
  callAdapter: CallAdapter;
  fluentTheme?: PartialTheme | Theme;
  hidden: boolean;
  onClose: () => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onChatButtonClick: () => void;
  onPeopleButtonClick: () => void;
  modalLayerHostId: string;
  mobileView?: boolean;
}): JSX.Element => {
  const callWithChatStrings = useCallWithChatCompositeStrings();
  const theme = useTheme();

  const mobilePaneStyles: MobilePaneWithLocalAndRemotePIPStyles = useMemo(
    () => ({
      modal: {
        main: {
          top: '3.25rem',
          borderRadius: theme.effects.roundedCorner4,
          boxShadow: theme.effects.elevation8,
          ...(theme.rtl ? { left: '1rem' } : { right: '1rem' })
        }
      }
    }),
    [theme]
  );

  const chatComposite = (
    <ChatComposite
      {...props.chatCompositeProps}
      adapter={props.chatAdapter}
      fluentTheme={props.fluentTheme}
      options={{
        topic: false,
        /* @conditional-compile-remove(chat-composite-participant-pane) */ participantPane: false
      }}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
    />
  );

  if (props.mobileView) {
    return (
      <MobilePaneWithLocalAndRemotePIP
        hidden={props.hidden}
        dataUiId={'call-with-chat-composite-chat-pane'}
        onClose={props.onClose}
        activeTab="chat"
        onChatButtonClicked={props.onChatButtonClick}
        onPeopleButtonClicked={props.onPeopleButtonClick}
        callAdapter={props.callAdapter}
        modalLayerHostId={props.modalLayerHostId}
        styles={mobilePaneStyles}
      >
        {chatComposite}
      </MobilePaneWithLocalAndRemotePIP>
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

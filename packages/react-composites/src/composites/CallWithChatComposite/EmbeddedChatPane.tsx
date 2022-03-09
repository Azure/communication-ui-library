// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PartialTheme, Theme, useTheme } from '@fluentui/react';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { ChatAdapter, ChatComposite, ChatCompositeProps } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import { WithLocalAndRemotePIP, WithLocalAndRemotePIPStyles } from './WithLocalAndRemotePIP';
import { MobilePane } from './MobilePane';
import { SidePane } from './SidePane';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingOptions } from '../ChatComposite';

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
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
}): JSX.Element => {
  const callWithChatStrings = useCallWithChatCompositeStrings();
  const theme = useTheme();

  const pipStyles: WithLocalAndRemotePIPStyles = useMemo(
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
        /* @conditional-compile-remove(chat-composite-participant-pane) */
        participantPane: false,
        /* @conditional-compile-remove(file-sharing) */
        fileSharing: props.fileSharing
      }}
      onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
    />
  );

  if (props.mobileView) {
    return (
      <WithLocalAndRemotePIP
        callAdapter={props.callAdapter}
        hidden={props.hidden}
        modalLayerHostId={props.modalLayerHostId}
        styles={pipStyles}
      >
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
      </WithLocalAndRemotePIP>
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PartialTheme, Theme } from '@fluentui/react';
import React from 'react';
import { ChatAdapter, ChatComposite, ChatCompositeProps } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
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
  fluentTheme?: PartialTheme | Theme;
  hidden: boolean;
  onClose: () => void;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onChatButtonClick: () => void;
  onPeopleButtonClick: () => void;
  mobileView?: boolean;
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
}): JSX.Element => {
  const callWithChatStrings = useCallWithChatCompositeStrings();

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

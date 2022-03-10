// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PartialTheme, Theme } from '@fluentui/react';
import React from 'react';
import { ChatAdapter, ChatComposite, ChatCompositeProps, FileSharingOptions } from '../ChatComposite';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';

/**
 * @private
 */
export const ChatContent = (props: {
  chatCompositeProps: Partial<ChatCompositeProps>;
  chatAdapter: ChatAdapter;
  fluentTheme?: PartialTheme | Theme;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
}): JSX.Element => {
  return (
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
};

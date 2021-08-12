// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ChatScreen } from './ChatScreen';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { ChatAdapter } from './adapter/ChatAdapter';
import { Theme, PartialTheme } from '@fluentui/react';
import { AvatarData } from '@internal/react-components';

import {
  CommunicationParticipant,
  DefaultMessageRendererType,
  FluentThemeProvider,
  LocalizationProvider,
  MessageProps,
  IdentifierProvider,
  Identifiers,
  Locale
} from '@internal/react-components';

export type ChatCompositeProps = {
  adapter: ChatAdapter;
  /**
   * Fluent theme for the composite.
   *
   * @defaultValue light theme
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Whether composite is displayed right-to-left.
   *
   * @defaultValue false
   */
  rtl?: boolean;
  /**
   * Locale for the composite.
   *
   * @defaultValue English (US)
   */
  locale?: Locale;
  /**
   * A callback function that can be used to provide custom data to an Avatar.
   */
  customAvatarDataProvider?: (userId) => Promise<AvatarData>;
  onRenderAvatar?: (userId: string, avatarType?: 'chatThread' | 'participantList') => JSX.Element;
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: DefaultMessageRendererType) => JSX.Element;
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
  options?: ChatOptions;
  identifiers?: Identifiers;
};

/**
 * Additional customizations for the chat composite
 */
export type ChatOptions = {
  /**
   * UNSTABLE: Feature flag to enable ErrorBar.
   *
   * This option will be removed once ErrorBar is stable.
   * @experimental
   *
   * @defaultValue false
   */
  showErrorBar?: boolean;
  /**
   * Choose to show the participant pane
   * @defaultValue false
   */
  showParticipantPane?: boolean;
  /**
   * Choose to show the topic at the top of the chat
   * @defaultValue false
   */
  showTopic?: boolean;
};

export const ChatComposite = (props: ChatCompositeProps): JSX.Element => {
  const {
    adapter,
    fluentTheme,
    rtl,
    locale,
    options,
    identifiers,
    customAvatarDataProvider,
    onRenderAvatar,
    onRenderTypingIndicator,
    onRenderMessage
  } = props;

  const chatElement = (
    <FluentThemeProvider fluentTheme={fluentTheme} rtl={rtl}>
      <IdentifierProvider identifiers={identifiers}>
        <ChatAdapterProvider adapter={adapter}>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <ChatScreen
            showErrorBar={options?.showErrorBar}
            showParticipantPane={options?.showParticipantPane}
            showTopic={options?.showTopic}
            customAvatarDataProvider={customAvatarDataProvider}
            onRenderAvatar={onRenderAvatar}
            onRenderTypingIndicator={onRenderTypingIndicator}
            onRenderMessage={onRenderMessage}
          />
        </ChatAdapterProvider>
      </IdentifierProvider>
    </FluentThemeProvider>
  );

  return locale ? LocalizationProvider({ locale, children: chatElement }) : chatElement;
};

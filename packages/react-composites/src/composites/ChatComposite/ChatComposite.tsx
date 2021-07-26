// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ChatScreen } from './ChatScreen';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { ChatAdapter } from './adapter/ChatAdapter';
import { Theme, PartialTheme } from '@fluentui/react';
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
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Locale for the composite.
   *
   * Defaults to a English (US) locale if undefined.
   */
  locale?: Locale;
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
    locale,
    options,
    identifiers,
    onRenderAvatar,
    onRenderTypingIndicator,
    onRenderMessage
  } = props;

  const chatElement = (
    <FluentThemeProvider fluentTheme={fluentTheme}>
      <IdentifierProvider identifiers={identifiers}>
        <ChatAdapterProvider adapter={adapter}>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
          <ChatScreen
            showErrorBar={options?.showErrorBar}
            showParticipantPane={options?.showParticipantPane}
            showTopic={options?.showTopic}
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ChatScreen } from './ChatScreen';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { ChatAdapter } from './adapter/ChatAdapter';
import { CompositeLocale, LocalizationProvider } from '../localization';
import { Theme, PartialTheme } from '@fluentui/react';
import {
  CommunicationParticipant,
  DefaultMessageRendererType,
  FluentThemeProvider,
  MessageProps,
  IdentifierProvider,
  Identifiers
} from '@internal/react-components';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';

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
  locale?: CompositeLocale;
  /**
   * A callback function that can be used to provide custom data to an Avatar.
   */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  /**
   * `(messageProps: MessageProps, defaultOnRender?: DefaultMessageRendererType) => JSX.Element`
   * A callback for customizing the message renderer.
   */
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: DefaultMessageRendererType) => JSX.Element;
  /**
   * `(typingUsers: CommunicationParticipant[]) => JSX.Element`
   * A callback for customizing the typing indicator renderer.
   */
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
  /**
   * Additional customizations for the chat composite
   */
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
    onFetchAvatarPersonaData,
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
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            onRenderTypingIndicator={onRenderTypingIndicator}
            onRenderMessage={onRenderMessage}
          />
        </ChatAdapterProvider>
      </IdentifierProvider>
    </FluentThemeProvider>
  );

  return locale ? LocalizationProvider({ locale, children: chatElement }) : chatElement;
};

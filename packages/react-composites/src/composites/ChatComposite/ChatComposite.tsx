// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialTheme, registerIcons, Theme } from '@fluentui/react';
import {
  CommunicationParticipant,
  DefaultMessageRendererType,
  FluentThemeProvider,
  IdentifierProvider,
  Identifiers,
  MessageProps
} from '@internal/react-components';
import React from 'react';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { defaultCompositeIcons, DefaultCompositeIcons } from '../common/icons';
import { CompositeLocale, LocalizationProvider } from '../localization';
import { ChatAdapter } from './adapter/ChatAdapter';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { ChatScreen } from './ChatScreen';

export type ChatCompositeProps = {
  adapter: ChatAdapter;
  /**
   * Fluent theme for the composite.
   *
   * @defaultValue light theme
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Custom Icon override for the composite.
   * A JSX element can be provided to override the default icon.
   */
  icons?: DefaultCompositeIcons;
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
    onFetchAvatarPersonaData,
    onRenderTypingIndicator,
    onRenderMessage
  } = props;

  /**
   * We register the defaul icon mappings to ensure all icons render.
   */
  registerIcons(props.icons ? { icons: props.icons } : { icons: defaultCompositeIcons });

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

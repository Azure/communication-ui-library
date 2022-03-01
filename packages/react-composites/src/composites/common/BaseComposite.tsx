// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialTheme, registerIcons, Theme } from '@fluentui/react';
import { FluentThemeProvider, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { createContext, useContext } from 'react';
import { ChatCompositeIcons } from '..';
import { CompositeLocale, LocalizationProvider } from '../localization';
import { AvatarPersonaDataCallback } from './AvatarPersona';
import { CallCompositeIcons, DEFAULT_COMPOSITE_ICONS } from './icons';
/* @conditional-compile-remove(call-with-chat-composite) */
import { CallWithChatCompositeIcons } from './icons';

/**
 * Properties common to all composites exported from this library.
 *
 * @public
 */
export interface BaseCompositeProps<TIcons extends Record<string, JSX.Element>> {
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
  icons?: TIcons;
  /**
   * Locale for the composite.
   *
   * @defaultValue English (US)
   */
  locale?: CompositeLocale;
  /**
   * Whether composite is displayed right-to-left.
   *
   * @defaultValue false
   */
  rtl?: boolean;
  /**
   * A callback function that can be used to provide custom data to Avatars rendered
   * in Composite.
   */
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;

  /**
   * A callback function that can be used to provide custom menu items for a participant in
   * participant list.
   */
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
}

/**
 * A base provider {@link React.Context} to wrap components with other required providers
 * (e.g. icons, FluentThemeProvider, LocalizationProvider).
 *
 * Required providers are only wrapped once, with all other instances only passing children.
 *
 * @private
 */
export const BaseProvider = (
  props: BaseCompositeProps<
    | CallCompositeIcons
    | ChatCompositeIcons
    | /* @conditional-compile-remove(call-with-chat-composite) */ CallWithChatCompositeIcons
  > & {
    children: React.ReactNode;
  }
): JSX.Element => {
  const { fluentTheme, rtl, locale } = props;

  /**
   * Pass only the children if we previously registered icons, and have previously wrapped the children in
   * FluentThemeProvider and LocalizationProvider
   */
  const alreadyWrapped = useBase();
  if (alreadyWrapped) {
    return <>{props.children}</>;
  }

  /**
   * We register the default icon mappings merged with custom icons provided through props
   * to ensure all icons render correctly.
   */
  registerIcons({ icons: { ...DEFAULT_COMPOSITE_ICONS, ...props.icons } });

  const CompositeElement = (
    <FluentThemeProvider fluentTheme={fluentTheme} rtl={rtl}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      {props.children}
    </FluentThemeProvider>
  );
  const localizedElement = locale ? LocalizationProvider({ locale, children: CompositeElement }) : CompositeElement;
  return <BaseContext.Provider value={true}>{localizedElement}</BaseContext.Provider>;
};

/**
 * @private
 */
const BaseContext = createContext<boolean>(false);

/**
 * @private
 */
const useBase = (): boolean => useContext(BaseContext);

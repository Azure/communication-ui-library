// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PartialTheme, registerIcons, Theme } from '@fluentui/react';
import { FluentThemeProvider, ParticipantMenuItemsCallback } from '@internal/react-components';
import React, { createContext, useContext } from 'react';
import { ChatCompositeIcons } from '..';
import { CompositeLocale, LocalizationProvider } from '../localization';
import { AvatarPersonaDataCallback } from './AvatarPersona';
import { CallCompositeIcons, DEFAULT_COMPOSITE_ICONS } from './icons';

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
 * A single {@link React.Context} to wrap components with required providers (e.g. icons, theme, locale).
 *
 * English is hard: Use only once, so nested instances of this component do nothing.
 *
 * @private
 */
export const SingletonProvider = (
  props: BaseCompositeProps<CallCompositeIcons | ChatCompositeIcons> & { children: React.ReactNode }
): JSX.Element => {
  const { fluentTheme, rtl, locale } = props;

  const alreadyWrapped = useSingleton();
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
  return <SingletonContext.Provider value={true}>{localizedElement}</SingletonContext.Provider>;
};

const SingletonContext = createContext<boolean>(true);
const useSingleton = (): boolean => useContext(SingletonContext);

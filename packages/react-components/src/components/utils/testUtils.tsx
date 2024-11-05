// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { LocalizationProvider, ComponentLocale, ComponentStrings } from '../../localization/LocalizationProvider';
import { COMPONENT_LOCALE_EN_US } from '../../localization/locales';
import { PartialDeep } from 'type-fest';
import { render } from '@testing-library/react';
import LiveAnnouncer from '../Announcer/LiveAnnouncer';
import { _getKeys } from '@internal/acs-ui-common';
import { registerIcons } from '@fluentui/react';
import { DEFAULT_COMPONENT_ICONS } from '../../theming/icons';

const withLiveAnnouncerContext = (node: React.ReactElement): React.ReactElement => (
  <LiveAnnouncer>{node}</LiveAnnouncer>
);

/** @private */
export const renderWithLiveAnnouncer = (
  node: React.ReactElement
): {
  rerender: (node: React.ReactElement) => void;
  container: HTMLElement;
} => {
  const { rerender, container } = render(withLiveAnnouncerContext(node));
  return {
    // wrap rerender in a function that will re-wrap the node with the LiveAnnouncerProvider
    rerender: (node: React.ReactElement) => rerender(withLiveAnnouncerContext(node)),
    container
  };
};

/** @private */
export const renderWithLocalization = (
  node: React.ReactElement,
  locale: ComponentLocale
): {
  rerender: (node: React.ReactElement) => void;
  container: HTMLElement;
} => {
  const { rerender, container } = renderWithLiveAnnouncer(
    <LocalizationProvider locale={locale}>{node}</LocalizationProvider>
  );
  return {
    // wrap rerender in a function that will re-wrap the node with the LocalizationProvider
    rerender: (node: React.ReactElement) =>
      rerender(<LocalizationProvider locale={locale}>{node}</LocalizationProvider>),
    container
  };
};

/**
 * @private
 */
export const createTestLocale = (testStrings: PartialDeep<ComponentStrings>): ComponentLocale => {
  const strings: ComponentStrings = COMPONENT_LOCALE_EN_US.strings;
  _getKeys(testStrings).forEach((key) => {
    // mark the value as unknown because the type changes based on the key.
    // this is unsafe at runtime as we could assign the wrong type based on the key here.
    // but typescript isn't smart enough to know that the key used across each access will result in the same type
    (strings as Record<keyof ComponentStrings, unknown>)[key] = { ...strings[key], ...testStrings[key] };
  });
  return { strings };
};

/** @private */
export const registerIconsForTests = (): void => {
  registerIcons({
    icons: {
      ...DEFAULT_COMPONENT_ICONS,
      chevronDown: <></>,
      clear: <></>,
      cancel: <></>,
      info: <></>,
      download: <></>,
      contact: <></>,
      genericfile24_svg: <></>,
      docx24_svg: <></>,
      pdf24_svg: <></>,
      ppt24_svg: <></>,
      txt24_svg: <></>,
      xlxs24_svg: <></>
    }
  });
};

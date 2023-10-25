// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { LocalizationProvider, ComponentLocale, ComponentStrings } from '../../localization/LocalizationProvider';
import { COMPONENT_LOCALE_EN_US } from '../../localization/locales';
import { PartialDeep } from 'type-fest';
import { render } from '@testing-library/react';
import LiveAnnouncer from '../Announcer/LiveAnnouncer';

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
  Object.keys(testStrings).forEach((key: string) => {
    strings[key] = { ...strings[key], ...testStrings[key] };
  });
  return { strings };
};

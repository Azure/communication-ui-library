// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { LocalizationProvider, ComponentLocale, ComponentStrings } from '../../localization/LocalizationProvider';
import { COMPONENT_LOCALE_EN_US } from '../../localization/locales';
import { PartialDeep } from 'type-fest';
import { _PermissionsProvider, _getPermissions, _Permissions } from '../../permissions';
import { render } from '@testing-library/react';
import { LiveAnnouncer } from 'react-aria-live';

const withLiveAnnouncerContext = (node: React.ReactElement): React.ReactElement => (
  <LiveAnnouncer>{node}</LiveAnnouncer>
);

/** @private */
export const renderWithLocalization = (
  node: React.ReactElement,
  locale: ComponentLocale
): {
  rerender: (node: React.ReactElement) => void;
  container: HTMLElement;
} => {
  const { rerender, container } = render(
    withLiveAnnouncerContext(<LocalizationProvider locale={locale}>{node}</LocalizationProvider>)
  );
  return {
    // wrap rerender in a function that will re-wrap the node with the LocalizationProvider
    rerender: (node: React.ReactElement) =>
      rerender(withLiveAnnouncerContext(<LocalizationProvider locale={locale}>{node}</LocalizationProvider>)),
    container
  };
};

/** @private */
export const renderWithPermissions = (
  node: React.ReactElement,
  permissions: _Permissions
): {
  rerender: (node: React.ReactElement) => void;
  container: HTMLElement;
} => {
  const { rerender, container } = render(<_PermissionsProvider permissions={permissions}>{node}</_PermissionsProvider>);
  return {
    // wrap rerender in a function that will re-wrap the node with the Provider
    rerender: (node: React.ReactElement) =>
      rerender(<_PermissionsProvider permissions={permissions}>{node}</_PermissionsProvider>),
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { LocalizationProvider, ComponentLocale, ComponentStrings } from '../../localization/LocalizationProvider';
import { COMPONENT_LOCALE_EN_US } from '../../localization/locales';
import { PartialDeep } from 'type-fest';
import { _PermissionsProvider, _getPermissions, _Permissions } from '../../permissions';
import { render } from '@testing-library/react';
import { LiveAnnouncer } from 'react-aria-live';

/**
 * @private
 */
export const mountWithLocalization = (node: React.ReactElement, locale: ComponentLocale): ReactWrapper => {
  return mount(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: { locale }
  });
};

const withLiveAnnouncerContext = (node: React.ReactElement): React.ReactElement => (
  <LiveAnnouncer>{node}</LiveAnnouncer>
);

/** @private */
export const renderWithLocalization = (
  node: React.ReactElement,
  locale: ComponentLocale
): {
  rerender: (node: React.ReactElement) => void;
} => {
  const { rerender } = render(
    withLiveAnnouncerContext(<LocalizationProvider locale={locale}>{node}</LocalizationProvider>)
  );
  return {
    // wrap rerender in a function that will re-wrap the node with the LocalizationProvider
    rerender: (node: React.ReactElement) =>
      rerender(withLiveAnnouncerContext(<LocalizationProvider locale={locale}>{node}</LocalizationProvider>))
  };
};

/**
 * @private
 */
export const shallowWithLocalization = (node: React.ReactElement, locale: ComponentLocale): ShallowWrapper => {
  return shallow(node, {
    wrappingComponent: LocalizationProvider,
    wrappingComponentProps: { locale }
  });
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

/**
 * @private
 */
export const mountWithPermissions = (node: React.ReactElement, permissions: _Permissions): ReactWrapper => {
  return mount(node, {
    wrappingComponent: _PermissionsProvider,
    wrappingComponentProps: { permissions }
  });
};

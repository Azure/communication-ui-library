// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import {
  Checkmark16Regular,
  ChevronDown20Regular,
  ChevronRight20Regular,
  Dismiss16Regular,
  DismissCircle16Regular,
  DocumentError20Regular,
  DrinkCoffee20Filled,
  Link16Regular,
  People16Regular,
  PeopleAdd16Regular,
  Warning16Regular
} from '@fluentui/react-icons';

///
/// This file is only for use by the test apps
///

/**
 * This is a quick fix to cope with flakiness in UI tests were font icons have not yet been downloaded.
 * Remove this once we are no longer reliant on Fluent's font icons and only used bundled SVG icons.
 */
export function initializeIconsForUITests(): void {
  // Register icons that are normally downloaded from Fluent's CDN that are causing flakiness
  registerIcons({
    icons: {
      Accept: <Checkmark16Regular />,
      Cancel: <Dismiss16Regular />,
      CheckMark: <Checkmark16Regular />,
      ChevronDown: <ChevronDown20Regular />,
      ChevronRight: <ChevronRight20Regular />,
      ErrorBadge: <DismissCircle16Regular />,
      Link: <Link16Regular />,
      // The composite uses a unicode icon by default that is rendered differently
      // in different fonts. Remove this source of flakiness by overriding with
      // an SVG icon.
      LobbyScreenWaitingToBeAdmitted: <DrinkCoffee20Filled />,
      People: <People16Regular />,
      PeopleAdd: <PeopleAdd16Regular />,
      ProtectedDocument: <DocumentError20Regular />,
      Warning: <Warning16Regular />
    }
  });

  // Catch any unregistered icons as not including them in a context menu is causing the app to hang.
  initializeIcons();
}

/**
 * Throw error if required parameter exists.
 * Return parameter for easy usage.
 *
 * @private
 */
export function verifyParamExists<T>(param: T, paramName: string): T {
  if (!param) {
    throw `${paramName} was not included in the query parameters of the URL.`;
  }

  return param;
}

/**
 * Detect if the test is run in a mobile browser.
 *
 * @remarks User agent string is not sufficient alone to detect if a device is mobile. It is
 * sufficient for our tests however.
 *
 * @private
 */
export const isMobile = (): boolean =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { registerIcons } from '@fluentui/react';
import {
  ChevronDown20Regular,
  ChevronRight20Regular,
  Dismiss20Regular,
  DismissCircle16Regular,
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
      Cancel: <Dismiss20Regular />,
      ChevronDown: <ChevronDown20Regular />,
      ChevronRight: <ChevronRight20Regular />,
      ErrorBadge: <DismissCircle16Regular />,
      Link: <Link16Regular />,
      People: <People16Regular />,
      PeopleAdd: <PeopleAdd16Regular />,
      Warning: <Warning16Regular />
    }
  });
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
/**
 * Strings for UnsupportedBrowser component
 *
 * @beta
 */
export interface UnsupportedBrowserStrings {
  /** String for the primary text */
  primaryText: string;
  /** String for the secondary text */
  secondaryText: string;
  /** String for the help link */
  moreHelpLink: string;
}

/**
 * props for UnsupportedBrowser UI
 *
 * @beta
 */
export interface UnsupportedBrowserProps {
  /** Handler to perform a action when the help link is actioned */
  onTroubleShootingClick: () => void;
  /** String overrides for the component */
  strings: UnsupportedBrowserStrings;
}

/**
 * UI to display to the user that the browser they are using is not supported by calling application.
 *
 * @beta
 */
export const UnsupportedBrowser = (props: UnsupportedBrowserProps): JSX.Element => {
  return <></>;
};

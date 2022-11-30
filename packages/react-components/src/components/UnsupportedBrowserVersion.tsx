// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
import { UnsupportedEnvironment } from './UnsupportedEnvironment';

/**
 * Strings for UnsupportedBrowser component
 *
 * @beta
 */
export interface UnsupportedBrowserVersionStrings {
  /** String for the primary text */
  primaryText: string;
  /** String for the secondary text */
  secondaryText: string;
  /** String to display in the text for the help link */
  moreHelpText: string;
}

/**
 * props for {@link UnsupportedBrowserVersion} UI
 *
 * @beta
 */
export interface UnsupportedBrowserVersionProps {
  /** Handler to perform an action when the help link is actioned */
  onTroubleshootingClick?: () => void;
  /** String overrides for the component */
  strings: UnsupportedBrowserVersionStrings;
}

/**
 * UI to display to the user that the browser version they are using is out of date
 * and not supported by Azure Communications Calling service.
 *
 * @beta
 */
export const UnsupportedBrowserVersion = (props: UnsupportedBrowserVersionProps): JSX.Element => {
  const { onTroubleshootingClick, strings } = props;
  return <UnsupportedEnvironment onTroubleshootingClick={onTroubleshootingClick} strings={strings} />;
};

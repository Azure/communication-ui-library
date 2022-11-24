// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(unsupported-browser) */
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import { UnsupportedEnvironment } from './UnsupportedEnvironment';

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
  /** String to display in the text for the help link */
  moreHelpText: string;
}

/**
 * props for {@link UnsupportedBrowser} UI
 *
 * @beta
 */
export interface UnsupportedBrowserProps {
  /** Handler to perform a action when the help link is actioned */
  onTroubleshootingClick?: () => void;
  /** String overrides for the component */
  strings: UnsupportedBrowserStrings;
}

/**
 * UI to display to the user that the browser they are using is not supported by Azure Communications Calling service.
 *
 * @beta
 */
export const UnsupportedBrowser = (props: UnsupportedBrowserProps): JSX.Element => {
  /* @conditional-compile-remove(unsupported-browser) */
  const { onTroubleshootingClick, strings } = props;
  /* @conditional-compile-remove(unsupported-browser) */
  return <UnsupportedEnvironment onTroubleshootingClick={onTroubleshootingClick} strings={strings} />;
  return <></>;
};

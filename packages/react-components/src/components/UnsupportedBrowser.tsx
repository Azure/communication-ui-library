// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
import { ComponentLocale, useLocale } from '../localization';
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
  moreHelpLinkText: string;
}

/**
 * props for {@link UnsupportedBrowser} UI
 *
 * @beta
 */
export interface UnsupportedBrowserProps {
  /** Handler to perform an action when the help link is actioned */
  onTroubleshootingClick?: () => void;
  /** String overrides for the component */
  strings?: UnsupportedBrowserStrings;
}

/**
 * UI to display to the user that the browser they are using is not supported by Azure Communications Calling service.
 *
 * @beta
 */
export const UnsupportedBrowser = (props: UnsupportedBrowserProps): JSX.Element => {
  const { onTroubleshootingClick, strings } = props;
  const locale = useLocale();
  return (
    <UnsupportedEnvironment
      onTroubleshootingClick={onTroubleshootingClick}
      strings={{ ...unsupportedBrowserStringsTrampoline(locale), ...strings }}
    />
  );
};

const unsupportedBrowserStringsTrampoline = (locale: ComponentLocale): UnsupportedBrowserStrings => {
  /* @conditional-compile-remove(unsupported-browser) */
  return locale.strings.UnsupportedBrowser;
  return {
    primaryText: '',
    secondaryText: '',
    moreHelpLinkText: ''
  };
};

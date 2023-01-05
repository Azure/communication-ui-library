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
export interface UnsupportedOperatingSystemStrings {
  /** String for the primary text */
  primaryText: string;
  /** String for the secondary text */
  secondaryText: string;
  /** String to display in the text for the help link */
  moreHelpLinkText: string;
}

/**
 * Props for {@link UnsupportedOperatingSystem} UI
 *
 * @beta
 */
export interface UnsupportedOperatingSystemProps {
  /** Handler to perform a action when the help link is actioned */
  onTroubleshootingClick?: () => void;
  /** String overrides for the component */
  strings?: UnsupportedOperatingSystemStrings;
}

/**
 * UI to display to the user that the operating system they are using is not supported by Azure Communications Calling service.
 *
 * @beta
 */
export const UnsupportedOperatingSystem = (props: UnsupportedOperatingSystemProps): JSX.Element => {
  const { onTroubleshootingClick, strings } = props;
  const locale = useLocale();
  return (
    <UnsupportedEnvironment
      onTroubleshootingClick={onTroubleshootingClick}
      strings={{ ...unsupportedOperatingSystemStringsTrampoline(locale), ...strings }}
    />
  );
};

const unsupportedOperatingSystemStringsTrampoline = (locale: ComponentLocale): UnsupportedOperatingSystemStrings => {
  /* @conditional-compile-remove(unsupported-browser) */
  return locale.strings.UnsupportedOperatingSystem;
  return {
    primaryText: '',
    secondaryText: '',
    moreHelpLinkText: ''
  };
};

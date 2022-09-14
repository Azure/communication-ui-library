// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Link, Stack, Text } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import { useLocale } from '../localization';
import {
  containerStyles,
  linkTextStyles,
  mainTextStyles,
  secondaryTextStyles
} from './styles/UnsupportedBrowser.styles';

/**
 * Strings for UnsupportedBrowser component
 *
 * @beta
 */
export type UnsupportedBrowserStrings = {
  /** String for the primary text */
  primaryText: string;
  /** String for the secondary text */
  secondaryText: string;
  /** String for the help link */
  moreHelpLink: string;
};

/**
 * props for UnsupportedBrowser UI
 *
 * @beta
 */
export type UnsupportedBrowserProps = {
  /** Handler to perform a action when the help link is actioned */
  onTroubleShootingClick: () => void;
  /** String overrides for the component */
  strings: UnsupportedBrowserStrings;
};

const UnsupportedBrowserContainer = (props: UnsupportedBrowserProps): JSX.Element => {
  const { onTroubleShootingClick, strings } = props;
  console.log('test2');
  return (
    <Stack styles={containerStyles}>
      <Icon iconName="UnsupportedBrowserWarning"></Icon>
      <Text styles={mainTextStyles}>{strings.primaryText}</Text>
      <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
      <Link
        styles={linkTextStyles}
        onClick={() => {
          onTroubleShootingClick();
        }}
      >
        {strings.moreHelpLink}
      </Link>
    </Stack>
  );
};

/**
 * UI to display to the user that the browser they are using is not supported by calling application.
 *
 * @beta
 */
export const UnsupportedBrowser = (props: UnsupportedBrowserProps): JSX.Element => {
  /* @conditional-compile-remove(unsupported-browser) */
  const strings = useLocale().strings.UnsupportedBrowser;
  /* @conditional-compile-remove(unsupported-browser) */
  return <UnsupportedBrowserContainer {...props} strings={strings} />;
  return <></>;
};

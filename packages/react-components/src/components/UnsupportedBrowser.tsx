// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, ILinkStyles, IStackStyles, ITextStyles, Link, Stack, Text } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../localization';

/**
 * @beta
 */
export type UnsupportedBrowserStrings = {
  primaryText: string;
  secondaryText: string;
  moreHelpLink: string;
};

/**
 * @internal
 */
export type _UnsupportedBrowserProps = {
  onTroubleShootingClick: () => void;
  strings: UnsupportedBrowserStrings;
};

/**
 * @internal
 */
export const _UnsupportedBrowserContainer = (props: _UnsupportedBrowserProps): JSX.Element => {
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
 *
 * @internal
 */
export const _UnsupportedBrowser = (props: _UnsupportedBrowserProps): JSX.Element => {
  console.log('test1');
  /* @conditional-compile-remove(call-readiness) */
  const strings = useLocale().strings.UnsupportedBrowser;
  return <_UnsupportedBrowserContainer {...props} strings={strings} />;
};

const mainTextStyles: ITextStyles = {
  root: {
    fontWeight: 600,
    fontSize: _pxToRem(20),
    lineHeight: _pxToRem(28),
    paddingBottom: '1rem',
    margin: 'auto'
  }
};

const secondaryTextStyles: ITextStyles = {
  root: {
    margin: 'auto',
    fontWeight: 400,
    paddingBottom: '0.5rem'
  }
};

const linkTextStyles: ILinkStyles = {
  root: {
    margin: 'auto',
    fontWeight: 600,
    textAlign: 'inherit'
  }
};

const containerStyles: IStackStyles = {
  root: {
    padding: '2rem',
    maxWidth: '25.374rem'
  }
};

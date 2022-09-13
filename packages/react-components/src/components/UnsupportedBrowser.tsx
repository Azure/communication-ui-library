// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Link, Stack, Text } from '@fluentui/react';
import React from 'react';
/* @conditional-compile-remove(call-readiness) */
import { useLocale } from '../localization';

/**
 * @internal
 */
export type _UnsupportedBrowserStrings = {
  primaryText: string;
  secondaryText: string;
  CompatibleBrowsersLinkButtonLabel: string;
  moreHelpLink: string;
};

/**
 * @internal
 */
export type _UnsupportedBrowserProps = {
  onTroubleShootingClick: () => void;
  strings: _UnsupportedBrowserStrings;
};

/**
 * @internal
 */
export const _UnsupportedBrowserContainer = (props: _UnsupportedBrowserProps): JSX.Element => {
  const { onTroubleShootingClick, strings } = props;
  return (
    <Stack>
      <Icon iconName="UnsupportedBorwserWarning"></Icon>
      <Text>{strings.primaryText}</Text>
      <Text>{strings.secondaryText}</Text>
      <Link
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
  /* @conditional-compile-remove(call-readiness) */
  const strings = useLocale().strings.UnsupportedBrowser;
  return <_UnsupportedBrowser {...props} strings={strings} />;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rtt) */
import { Icon, Link, Stack, Text, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(rtt) */
import React from 'react';
/* @conditional-compile-remove(rtt) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(rtt) */
import {
  bannerContainerStyles,
  bannerContentStyles,
  bannerLinkStyles,
  bannerTitleClassName
} from './styles/RTTDisclosureBanner.styles';

/* @conditional-compile-remove(rtt) */
/**
 * @beta
 * strings for rtt modal
 */
export interface RTTDisclosureBannerStrings {
  bannerTitle?: string;
  bannerContent?: string;
  bannerLinkLabel?: string;
}

/* @conditional-compile-remove(rtt) */
/**
 * @beta
 * Props for RTT Banner
 */
export interface RTTDisclosureBannerProps {
  /** Link to learn more about RTT */
  link?: string;
  /** RTT Banner strings */
  strings?: RTTDisclosureBannerStrings;
}

/* @conditional-compile-remove(rtt) */
/**
 * @beta
 * Banner to disclose that RTT is enabled for all participants for the entire duration of the meeting.
 */
export const RTTDisclosureBanner = (props: RTTDisclosureBannerProps): JSX.Element => {
  const localeStrings = useLocale().strings.rttDisclosureBanner;
  const strings = { ...localeStrings, ...props.strings };
  const theme = useTheme();

  return (
    <Stack className={bannerContainerStyles()}>
      <Stack horizontal>
        <Icon iconName="RTTIcon" />
        <Text className={bannerTitleClassName}>{strings.bannerTitle}</Text>
      </Stack>
      <Stack.Item>
        <Text className={bannerContentStyles(theme)}>
          {strings.bannerContent}
          <Link className={bannerLinkStyles(theme)} href={props.link} target="_blank">
            {strings.bannerLinkLabel}
          </Link>
        </Text>
      </Stack.Item>
    </Stack>
  );
};

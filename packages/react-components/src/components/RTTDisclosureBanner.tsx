// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rtt) */
import React from 'react';
/* @conditional-compile-remove(rtt) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(rtt) */
import { Notification } from './Notification';
/* @conditional-compile-remove(rtt) */
import { useTheme } from '@fluentui/react';
/* @conditional-compile-remove(rtt) */
import { rttContainerStyles } from './styles/RTTDisclosureBanner.styles';

/* @conditional-compile-remove(rtt) */
/**
 * @beta
 * strings for rtt modal
 */
export interface RTTDisclosureBannerStrings {
  bannerTitle: string;
  bannerContent: string;
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
    <Notification
      notificationStrings={{
        title: strings.bannerTitle,
        message: strings.bannerContent,
        linkLabel: strings.bannerLinkLabel
      }}
      notificationIconProps={{ iconName: 'RTTIcon' }}
      link={props.link}
      styles={{ root: rttContainerStyles(theme) }}
    />
  );
};

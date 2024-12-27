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
import { rttContainerStyles, rttIconStyles } from './styles/RTTDisclosureBanner.styles';

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
  /**
   * Optional callback to supply users with further troubleshooting steps or more information for the Real Time Text feature.
   */
  onClickLink?: () => void;
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
      notificationIconProps={{
        iconName: 'RealTimeTextIcon',
        styles: rttIconStyles()
      }}
      onClickLink={props.onClickLink}
      styles={{ root: rttContainerStyles(theme) }}
    />
  );
};

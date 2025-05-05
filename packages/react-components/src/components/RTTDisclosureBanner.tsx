// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { Notification } from './Notification';
import { useTheme } from '@fluentui/react';
import { rttContainerStyles, rttIconStyles } from './styles/RTTDisclosureBanner.styles';

/**
 * @private
 * strings for rtt modal
 */
export interface _RTTDisclosureBannerStrings {
  bannerTitle: string;
  bannerContent: string;
  bannerLinkLabel?: string;
}

/**
 * @private
 * Props for RTT Banner
 */
export interface _RTTDisclosureBannerProps {
  /**
   * Optional callback to supply users with further troubleshooting steps or more information for the Real Time Text feature.
   */
  onClickLink?: () => void;
  /** RTT Banner strings */
  strings?: _RTTDisclosureBannerStrings;
}

/**
 * @private
 * Banner to disclose that RTT is enabled for all participants for the entire duration of the meeting.
 */
export const _RTTDisclosureBanner = (props: _RTTDisclosureBannerProps): JSX.Element => {
  const strings = props.strings;
  const theme = useTheme();

  return (
    <Notification
      notificationStrings={{
        title: strings?.bannerTitle ?? '',
        message: strings?.bannerContent,
        linkLabel: strings?.bannerLinkLabel
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

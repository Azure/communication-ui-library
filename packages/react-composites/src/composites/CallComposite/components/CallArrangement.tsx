// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { ErrorBar, ErrorBarProps } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControls, CallControlsProps } from '../components/CallControls';
import { ComplianceBanner, ComplianceBannerProps } from '../components/ComplianceBanner';
import {
  notificationsContainerStyles,
  callControlsContainer,
  containerStyleDesktop,
  containerStyleMobile,
  mediaGalleryContainerStyles,
  subContainerStyles
} from '../styles/CallPage.styles';
import { MutedNotification, MutedNotificationProps } from './MutedNotification';

// High enough to be above `onRenderGalleryContent()`.
const NOTIFICATIONS_CONTAINER_ZINDEX = 9;

/**
 * @private
 */
export interface CallArrangementProps {
  complianceBannerProps: ComplianceBannerProps;
  errorBarProps: ErrorBarProps | false;
  mutedNotificationProps?: MutedNotificationProps;
  callControlProps: CallControlsProps | false;
  onRenderGalleryContent: () => JSX.Element;
  dataUiId: string;
  mobileView: boolean;
}

/**
 * @private
 */
export const CallArrangement = (props: CallArrangementProps): JSX.Element => {
  const containerClassName = useMemo(() => {
    return props.mobileView ? containerStyleMobile : containerStyleDesktop;
  }, [props.mobileView ? containerStyleMobile : containerStyleDesktop]);

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      className={containerClassName}
      grow
      data-ui-id={props.dataUiId}
    >
      <Stack.Item styles={notificationsContainerStyles(NOTIFICATIONS_CONTAINER_ZINDEX)}>
        <Stack>
          <ComplianceBanner {...props.complianceBannerProps} />
        </Stack>
        {props.errorBarProps !== false && (
          <Stack>
            <ErrorBar {...props.errorBarProps} />
          </Stack>
        )}
        {!!props.mutedNotificationProps && <MutedNotification {...props.mutedNotificationProps} />}
      </Stack.Item>

      <Stack.Item styles={subContainerStyles} grow>
        {props.onRenderGalleryContent && (
          <Stack grow styles={mediaGalleryContainerStyles}>
            {props.onRenderGalleryContent()}
          </Stack>
        )}
      </Stack.Item>

      {props.callControlProps !== false && (
        <Stack.Item className={callControlsContainer}>
          <CallControls {...props.callControlProps} />
        </Stack.Item>
      )}
    </Stack>
  );
};

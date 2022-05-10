// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import {
  _ComplianceBanner,
  _ComplianceBannerProps,
  _useContainerHeight,
  _useContainerWidth,
  ErrorBar,
  ErrorBarProps,
  useTheme
} from '@internal/react-components';
import React, { useMemo, useRef } from 'react';
import { containerDivStyles } from '../../common/ContainerRectProps';
import { CallControls, CallControlsProps } from '../components/CallControls';
import {
  callControlsContainerStyles,
  notificationsContainerStyles,
  containerStyleDesktop,
  containerStyleMobile,
  mediaGalleryContainerStyles,
  galleryParentContainerStyles,
  bannerNotificationStyles
} from '../styles/CallPage.styles';
import { MutedNotification, MutedNotificationProps } from './MutedNotification';

/**
 * @private
 */
export interface CallArrangementProps {
  complianceBannerProps: _ComplianceBannerProps;
  errorBarProps: ErrorBarProps | false;
  mutedNotificationProps?: MutedNotificationProps;
  callControlProps: CallControlsProps;
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
  }, [props.mobileView]);

  const theme = useTheme();
  const callGalleryStyles = useMemo(
    () => galleryParentContainerStyles(theme.palette.neutralLighterAlt),
    [theme.palette.neutralLighterAlt]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const containerHeight = _useContainerHeight(containerRef);

  return (
    <div ref={containerRef} className={mergeStyles(containerDivStyles)}>
      <Stack verticalFill horizontalAlign="stretch" className={containerClassName} data-ui-id={props.dataUiId}>
        <Stack.Item styles={notificationsContainerStyles}>
          <Stack styles={bannerNotificationStyles}>
            <_ComplianceBanner {...props.complianceBannerProps} />
          </Stack>
          {props.errorBarProps !== false && (
            <Stack styles={bannerNotificationStyles}>
              <ErrorBar {...props.errorBarProps} />
            </Stack>
          )}
          {!!props.mutedNotificationProps && <MutedNotification {...props.mutedNotificationProps} />}
        </Stack.Item>

        <Stack.Item styles={callGalleryStyles} grow>
          {props.onRenderGalleryContent && (
            <Stack verticalFill styles={mediaGalleryContainerStyles}>
              {props.onRenderGalleryContent()}
            </Stack>
          )}
        </Stack.Item>

        {props.callControlProps?.options !== false && (
          <Stack.Item className={callControlsContainerStyles}>
            <CallControls
              {...props.callControlProps}
              containerWidth={containerWidth}
              containerHeight={containerHeight}
            />
          </Stack.Item>
        )}
      </Stack>
    </div>
  );
};

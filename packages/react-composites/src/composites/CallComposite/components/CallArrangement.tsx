// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import { ErrorBar, ErrorBarProps, useTheme } from '@internal/react-components';
import React, { useMemo, useState } from 'react';
import { CallControls, CallControlsProps } from '../components/CallControls';
import { ComplianceBanner, ComplianceBannerProps } from '../components/ComplianceBanner';
import {
  callControlsContainerStyles,
  notificationsContainerStyles,
  containerStyleDesktop,
  containerStyleMobile,
  mediaGalleryContainerStyles,
  galleryParentContainerStyles
} from '../styles/CallPage.styles';
import { MutedNotification, MutedNotificationProps } from './MutedNotification';
import { ParticipantPane } from './ParticipantPane';

/**
 * @private
 */
export interface CallArrangementProps {
  complianceBannerProps: ComplianceBannerProps;
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

  const [showPeople, setShowPeople] = useState(false);

  return (
    <Stack className={mergeStyles({ width: '100%', height: '100%' })}>
      <ParticipantPane hidden={!showPeople} closePane={() => setShowPeople(false)} />
      <Stack
        verticalFill
        horizontalAlign="stretch"
        className={showPeople ? mergeStyles(containerClassName, { display: 'none' }) : containerClassName}
        data-ui-id={props.dataUiId}
      >
        <Stack.Item styles={notificationsContainerStyles}>
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
              onParticipantButtonClick={props.mobileView ? () => setShowPeople(true) : undefined}
            />
          </Stack.Item>
        )}
      </Stack>
    </Stack>
  );
};

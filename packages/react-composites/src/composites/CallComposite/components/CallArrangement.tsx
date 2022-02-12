// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import { ErrorBar, ErrorBarProps, useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
/* @conditional-compile-remove-from(stable) */
import { useState } from 'react';
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
/* @conditional-compile-remove-from(stable) */
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

  /* @conditional-compile-remove-from(stable) */
  const [showPeople, setShowPeople] = useState(false);

  /* @conditional-compile-remove-from(stable) */
  const renderParticipantPane = (): JSX.Element => {
    return <ParticipantPane hidden={!showPeople} closePane={() => setShowPeople(false)} />;
  };

  const callArrangementStyles = (): string => {
    /* @conditional-compile-remove-from(stable) */
    return showPeople ? mergeStyles(containerClassName, { display: 'none' }) : containerClassName;
    return containerClassName;
  };

  return (
    <Stack className={mergeStyles({ width: '100%', height: '100%' })}>
      {
        /* @conditional-compile-remove-from(stable) */
        renderParticipantPane()
      }
      <Stack verticalFill horizontalAlign="stretch" className={callArrangementStyles()} data-ui-id={props.dataUiId}>
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
              /* @conditional-compile-remove-from(stable) */
              onParticipantButtonClick={props.mobileView ? () => setShowPeople(true) : undefined}
            />
          </Stack.Item>
        )}
      </Stack>
    </Stack>
  );
};

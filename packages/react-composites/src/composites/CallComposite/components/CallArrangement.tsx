// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { ErrorBar, ErrorBarProps } from '@internal/react-components';
import React from 'react';
import { PermissionsBanner, PermissionsBannerProps } from '../../common/PermissionsBanner';
import { permissionsBannerContainerStyle } from '../../common/styles/PermissionsBanner.styles';
import { CallControls, CallControlsProps } from '../components/CallControls';
import { ComplianceBanner, ComplianceBannerProps } from '../components/ComplianceBanner';
import { MediaGallery, MediaGalleryProps } from '../components/MediaGallery';
import {
  bannersContainerStyles,
  callControlsContainer,
  containerStyles,
  mediaGalleryContainerStyles,
  subContainerStyles
} from '../styles/CallPage.styles';

/**
 * @private
 */
export interface CallArrangementProps {
  complianceBannerProps: ComplianceBannerProps;
  permissionBannerProps: PermissionsBannerProps;
  errorBarProps: ErrorBarProps | false;
  mediaGalleryProps: MediaGalleryProps | false;
  callControlProps: CallControlsProps | false;
}

/**
 * @private
 */
export const CallArrangement = (props: CallArrangementProps): JSX.Element => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
      <>
        <Stack.Item styles={bannersContainerStyles}>
          <Stack>
            <ComplianceBanner {...props.complianceBannerProps} />
          </Stack>
          <Stack style={permissionsBannerContainerStyle}>
            <PermissionsBanner {...props.permissionBannerProps} />
          </Stack>
          {props.errorBarProps !== false && (
            <Stack>
              <ErrorBar {...props.errorBarProps} />
            </Stack>
          )}
        </Stack.Item>

        <Stack.Item styles={subContainerStyles} grow>
          {props.mediaGalleryProps !== false && (
            <>
              <Stack grow styles={mediaGalleryContainerStyles}>
                <MediaGallery {...props.mediaGalleryProps} />
              </Stack>
            </>
          )}
        </Stack.Item>
        {props.callControlProps !== false && (
          <Stack.Item className={callControlsContainer}>
            <CallControls {...props.callControlProps} />
          </Stack.Item>
        )}
      </>
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { ErrorBar, OnRenderAvatarCallback, ParticipantMenuItemsCallback } from '@internal/react-components';
import React from 'react';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { PermissionsBanner } from '../../common/PermissionsBanner';
import { permissionsBannerContainerStyle } from '../../common/styles/PermissionsBanner.styles';
import { CallCompositeOptions } from '../CallComposite';
import { CallControls } from '../components/CallControls';
import { ComplianceBanner } from '../components/ComplianceBanner';
import { useHandlers } from '../hooks/useHandlers';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { MediaGallery } from '../components/MediaGallery';
import { callStatusSelector } from '../selectors/callStatusSelector';
import { complianceBannerSelector } from '../selectors/complianceBannerSelector';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { mediaGallerySelector } from '../selectors/mediaGallerySelector';
import {
  bannersContainerStyles,
  callControlsContainer,
  containerStyles,
  mediaGalleryContainerStyles,
  subContainerStyles
} from '../styles/CallPage.styles';
import { CallControlOptions } from '../components/CallControls';
import { CursorChatFluidModel } from '../../MeetingComposite/FluidModel';

/**
 * @private
 */
export interface CallPageProps {
  callInvitationURL?: string;
  endCallHandler(): void;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  /** If set, takes the center stage entirely. All other tiles are moved to horizontal gallery. */
  spotFocusTile?: JSX.Element;
  options?: CallCompositeOptions;
  fluidModel: CursorChatFluidModel;
}

/**
 * @private
 */
export const CallPage = (props: CallPageProps): JSX.Element => {
  const {
    callInvitationURL,
    endCallHandler,
    onRenderAvatar,
    onFetchAvatarPersonaData,
    onFetchParticipantMenuItems,
    options
  } = props;

  // To use useProps to get these states, we need to create another file wrapping Call,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  const { callStatus } = useSelector(callStatusSelector);
  const mediaGalleryProps = useSelector(mediaGallerySelector);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  const complianceBannerProps = useSelector(complianceBannerSelector);
  const errorBarProps = usePropsFor(ErrorBar);
  const devicePermissions = useSelector(devicePermissionSelector);

  // Reduce the controls shown when mobile view is enabled.
  let callControlOptions: false | CallControlOptions =
    options?.callControls !== false ? (options?.callControls === true ? {} : options?.callControls || {}) : false;
  if (callControlOptions && options?.mobileView) {
    callControlOptions.compressedMode = true;
    callControlOptions = reduceControlsSetForMobile(callControlOptions);
  }

  const screenShareModalHostId = 'UILibraryMediaGallery';
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
      <>
        <Stack.Item styles={bannersContainerStyles}>
          <Stack>
            <ComplianceBanner {...complianceBannerProps} />
          </Stack>
          <Stack style={permissionsBannerContainerStyle}>
            <PermissionsBanner
              microphonePermissionGranted={devicePermissions.audio}
              cameraPermissionGranted={devicePermissions.video}
            />
          </Stack>
          {options?.errorBar !== false && (
            <Stack>
              <ErrorBar {...errorBarProps} />
            </Stack>
          )}
        </Stack.Item>

        <Stack.Item styles={subContainerStyles} grow>
          {callStatus === 'Connected' && (
            <Stack id={screenShareModalHostId} grow styles={mediaGalleryContainerStyles}>
              <MediaGallery
                {...mediaGalleryProps}
                {...mediaGalleryHandlers}
                onRenderAvatar={onRenderAvatar}
                onFetchAvatarPersonaData={onFetchAvatarPersonaData}
                spotFocusTile={props.spotFocusTile}
                fluidModel={props.fluidModel}
              />
            </Stack>
          )}
        </Stack.Item>
        {callControlOptions !== false && (
          <Stack.Item className={callControlsContainer}>
            <CallControls
              onEndCallClick={endCallHandler}
              callInvitationURL={callInvitationURL}
              onFetchParticipantMenuItems={onFetchParticipantMenuItems}
              options={callControlOptions}
            />
          </Stack.Item>
        )}
      </>
    </Stack>
  );
};

/**
 * Reduce the set of call controls visible on mobile.
 * For example do not show screenshare button.
 */
const reduceControlsSetForMobile = (callControlOptions: CallControlOptions): CallControlOptions => {
  const reduceCallControlOptions = callControlOptions;

  // Do not show screen share button when composite is optimized for mobile unless the developer
  // has explicitly opted in.
  if (
    reduceCallControlOptions &&
    typeof reduceCallControlOptions !== 'boolean' &&
    reduceCallControlOptions.screenShareButton !== true
  ) {
    reduceCallControlOptions.screenShareButton = false;
  }

  return reduceCallControlOptions;
};

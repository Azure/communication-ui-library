// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorBar, OnRenderAvatarCallback, ParticipantMenuItemsCallback } from '@internal/react-components';
import React from 'react';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { CallCompositeOptions } from '../CallComposite';
import { useHandlers } from '../hooks/useHandlers';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { MediaGallery } from '../components/MediaGallery';
import { callStatusSelector } from '../selectors/callStatusSelector';
import { complianceBannerSelector } from '../selectors/complianceBannerSelector';
import { devicePermissionSelector } from '../selectors/devicePermissionSelector';
import { mediaGallerySelector } from '../selectors/mediaGallerySelector';
import { CallControlOptions } from '../components/CallControls';
import { CallArrangement } from '../components/CallArrangement';

/**
 * @private
 */
export interface CallPageProps {
  callInvitationURL?: string;
  endCallHandler(): void;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: CallCompositeOptions;
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

  return (
    <CallArrangement
      complianceBannerProps={{ ...complianceBannerProps }}
      permissionBannerProps={{
        microphonePermissionGranted: devicePermissions.audio,
        cameraPermissionGranted: devicePermissions.video
      }}
      errorBarProps={options?.errorBar !== false && { ...errorBarProps }}
      callControlProps={
        callControlOptions !== false && {
          onEndCallClick: endCallHandler,
          callInvitationURL: callInvitationURL,
          onFetchParticipantMenuItems: onFetchParticipantMenuItems,
          options: callControlOptions
        }
      }
      onRenderGalleryContent={() =>
        callStatus === 'Connected' ? (
          <MediaGallery
            {...mediaGalleryProps}
            {...mediaGalleryHandlers}
            onRenderAvatar={onRenderAvatar}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          />
        ) : (
          <></>
        )
      }
    />
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

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
import { CallArrangement } from '../components/CallArrangement';
import { reduceCallControlsForMobile } from '../utils';
import { mutedNotificationSelector } from '../selectors/mutedNotificationSelector';

/**
 * @private
 */
export interface CallPageProps {
  callInvitationURL?: string;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  options?: CallCompositeOptions;
}

/**
 * @private
 */
export const CallPage = (props: CallPageProps): JSX.Element => {
  const { callInvitationURL, onRenderAvatar, onFetchAvatarPersonaData, onFetchParticipantMenuItems, options } = props;

  // To use useProps to get these states, we need to create another file wrapping Call,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  const { callStatus } = useSelector(callStatusSelector);
  const mediaGalleryProps = useSelector(mediaGallerySelector);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  const complianceBannerProps = useSelector(complianceBannerSelector);
  const errorBarProps = usePropsFor(ErrorBar);
  const devicePermissions = useSelector(devicePermissionSelector);
  const mutedNotificationProps = useSelector(mutedNotificationSelector);

  // Reduce the controls shown when mobile view is enabled.
  const callControlOptions = options?.mobileView
    ? reduceCallControlsForMobile(options?.callControls)
    : options?.callControls;

  return (
    <CallArrangement
      complianceBannerProps={{ ...complianceBannerProps }}
      permissionBannerProps={{
        microphonePermissionGranted: devicePermissions.audio,
        cameraPermissionGranted: devicePermissions.video
      }}
      errorBarProps={options?.errorBar !== false && { ...errorBarProps }}
      mutedNotificationProps={mutedNotificationProps}
      callControlProps={
        callControlOptions !== false && {
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
      dataUiId={'call-page'}
    />
  );
};

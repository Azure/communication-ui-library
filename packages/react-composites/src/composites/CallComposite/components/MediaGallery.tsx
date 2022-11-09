// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  VideoGallery,
  VideoStreamOptions,
  OnRenderAvatarCallback,
  CustomAvatarOptions,
  Announcer
} from '@internal/react-components';
import { usePropsFor } from '../hooks/usePropsFor';
import { AvatarPersona, AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { mergeStyles, Stack } from '@fluentui/react';
import { getIsPreviewCameraOn } from '../selectors/baseSelectors';
import { useHandlers } from '../hooks/useHandlers';
import { useSelector } from '../hooks/useSelector';
import { localVideoCameraCycleButtonSelector } from '../selectors/LocalVideoTileSelector';
import { LocalVideoCameraCycleButton } from '@internal/react-components';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { useLocale } from '../../localization';
import { RemoteParticipant } from '@azure/communication-calling';
import { _formatString } from '@internal/acs-ui-common';

const VideoGalleryStyles = {
  root: {
    height: '100%',
    minHeight: '10rem', // space affordance to ensure media gallery is never collapsed
    minWidth: '6rem'
  }
};

const localVideoViewOptions = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

const remoteVideoViewOptions = {
  scalingMode: 'Crop'
} as VideoStreamOptions;

/**
 * @private
 */
export interface MediaGalleryProps {
  isVideoStreamOn?: boolean;
  isMicrophoneChecked?: boolean;
  onStartLocalVideo: () => Promise<void>;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  isMobile?: boolean;
}

/**
 * @private
 */
export const MediaGallery = (props: MediaGalleryProps): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraSwitcherCameras = useSelector(localVideoCameraCycleButtonSelector);
  const cameraSwitcherCallback = useHandlers(LocalVideoCameraCycleButton);
  const announcerString = useParticipantChangedAnnouncement();

  const cameraSwitcherProps = useMemo(() => {
    return {
      ...cameraSwitcherCallback,
      ...cameraSwitcherCameras
    };
  }, [cameraSwitcherCallback, cameraSwitcherCameras]);

  const onRenderAvatar = useCallback(
    (userId?: string, options?: CustomAvatarOptions) => {
      return (
        <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
          <Stack styles={{ root: { margin: 'auto', maxHeight: '100%' } }}>
            <AvatarPersona userId={userId} {...options} dataProvider={props.onFetchAvatarPersonaData} />
          </Stack>
        </Stack>
      );
    },
    [props.onFetchAvatarPersonaData]
  );

  useLocalVideoStartTrigger(!!props.isVideoStreamOn);
  const VideoGalleryMemoized = useMemo(() => {
    return (
      <>
        <Announcer announcementString={announcerString} ariaLive={'assertive'} />
        <VideoGallery
          {...videoGalleryProps}
          localVideoViewOptions={localVideoViewOptions}
          remoteVideoViewOptions={remoteVideoViewOptions}
          styles={VideoGalleryStyles}
          layout="floatingLocalVideo"
          showCameraSwitcherInLocalPreview={props.isMobile}
          localVideoCameraCycleButtonProps={cameraSwitcherProps}
          onRenderAvatar={onRenderAvatar}
        />
      </>
    );
  }, [videoGalleryProps, props.isMobile, onRenderAvatar, cameraSwitcherProps, announcerString]);

  return VideoGalleryMemoized;
};

/**
 * @private
 *
 * `shouldTransition` is an extra predicate that controls whether this hooks actually transitions the call.
 * The rule of hooks disallows calling the hook conditionally, so this predicate can be used to make the decision.
 */
export const useLocalVideoStartTrigger = (isLocalVideoAvailable: boolean, shouldTransition?: boolean): void => {
  // Once a call is joined, we need to transition the local preview camera setting into the call.
  // This logic is needed on any screen that we might join a call from:
  // - The Media gallery
  // - The lobby page
  // - The networkReconnect interstitial that may show at the start of a call.
  //
  // @TODO: Can we simply have the callHandlers handle this transition logic.
  const [isButtonStatusSynced, setIsButtonStatusSynced] = useState(false);
  const isPreviewCameraOn = useSelector(getIsPreviewCameraOn);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  useEffect(() => {
    if (shouldTransition !== false) {
      if (isPreviewCameraOn && !isLocalVideoAvailable && !isButtonStatusSynced) {
        mediaGalleryHandlers.onStartLocalVideo();
      }
      setIsButtonStatusSynced(true);
    }
  }, [shouldTransition, isButtonStatusSynced, isPreviewCameraOn, isLocalVideoAvailable, mediaGalleryHandlers]);
};

/**
 * sets the announcement string whenever a Participant comes or goes from a call to be
 * used by the system narrator.
 *
 * @returns string to be used by the narrator and Announcer component
 */
const useParticipantChangedAnnouncement = (): string => {
  const adapter = useAdapter();
  const locale = useLocale().strings.call;
  const [announcerString, setAnnouncerString] = useState<string>('');
  /**
   * state to track whether there is currently a timer set in the MediaGallery
   */
  const [timeoutState, setTimeoutState] = useState<ReturnType<typeof setTimeout>>();

  const setParticipantEventString = (string: string): void => {
    setAnnouncerString('');

    if (timeoutState) {
      clearTimeout(timeoutState);
      setTimeoutState(undefined);
    }
    setTimeoutState(
      /**
       * These set timeouts are needed to clear the announcer string in case we have multiple
       * participants join. Since the narrator will only announce the string in the
       * Announcer component should the string change.
       */
      setTimeout(() => {
        setAnnouncerString(string);
        setTimeoutState(undefined);
      }, 500)
    );
  };

  useEffect(() => {
    const onPersonJoined = (e: { joined: RemoteParticipant[] }): void => {
      setParticipantEventString(
        createAnnouncmentString(locale.participantJoinedNoticeString, locale.defaultParticipantChangedString, e.joined)
      );
    };
    adapter.on('participantsJoined', onPersonJoined);

    const onPersonLeft = (e: { removed: RemoteParticipant[] }): void => {
      setParticipantEventString(
        createAnnouncmentString(locale.participantLeftNoticeString, locale.defaultParticipantChangedString, e.removed)
      );
    };
    adapter.on('participantsLeft', onPersonLeft);

    return () => {
      adapter.off('participantsJoined', onPersonJoined);
      adapter.off('participantsLeft', onPersonLeft);
    };
  }, [adapter, locale.participantJoinedNoticeString, locale.participantLeftNoticeString, setParticipantEventString]);

  return announcerString;
};

/**
 * Generates the announcement string for when a participant joins or leaves a call.
 */
const createAnnouncmentString = (
  localeString: string,
  defaultName: string,
  participants?: RemoteParticipant[]
): string => {
  if (participants) {
    if (participants.length === 1) {
      return _formatString(localeString, {
        displayName: participants[0].displayName ? participants[0].displayName : defaultName
      });
    } else {
      let names = '';
      participants.forEach((p) => {
        if (names === '') {
          names = names + (p.displayName ? p.displayName : defaultName);
        }
        names = names + ' ' + (p.displayName ? p.displayName : defaultName);
      });
      return _formatString(localeString, { displayName: names });
    }
  } else {
    return _formatString(localeString, { displayName: defaultName });
  }
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, Stack, Text } from '@fluentui/react';
import React, { useMemo } from 'react';
import { useLocale } from '../../localization';
import { useTheme } from '../../theming';
import { CreateVideoStreamViewResult, VideoGalleryLocalParticipant, VideoStreamOptions } from '../../types';
import { VideoTile } from '../VideoTile';
import {
  screenShareVideoStyles,
  screenSharingContainerStyle,
  screenSharingNotificationContainerStyle,
  screenSharingNotificationIconContainerStyle,
  screenSharingNotificationIconStyle,
  screenSharingNotificationTextStyle
} from './styles/LocalScreenShare.styles';
import {
  LocalVideoStreamLifecycleMaintainerProps,
  useLocalVideoStreamLifecycleMaintainer
} from './useVideoStreamLifecycleMaintainer';
import { StreamMedia } from '../StreamMedia';

/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const LocalScreenShare = React.memo(
  (props: {
    localParticipant: VideoGalleryLocalParticipant;
    onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeLocalStreamView?: () => void;
  }) => {
    const { localParticipant, onCreateLocalStreamView, onDisposeLocalStreamView } = props;

    const { isAvailable, renderElement } = localParticipant.screenShareStream || {};
    const locale = useLocale();
    const localVideoStreamProps: LocalVideoStreamLifecycleMaintainerProps = useMemo(
      () => ({
        isMirrored: false,
        isStreamAvailable: isAvailable,
        isScreenSharingOn: isAvailable,
        onCreateLocalStreamView,
        onDisposeLocalStreamView,
        renderElementExists: !!renderElement,
        scalingMode: 'Fit'
      }),
      [isAvailable, onCreateLocalStreamView, onDisposeLocalStreamView, renderElement]
    );

    // Handle creating, destroying and updating the video stream as necessary
    useLocalVideoStreamLifecycleMaintainer(localVideoStreamProps);

    const { localVideoLabel } = useLocale().strings.videoGallery;

    const renderVideoStreamElement = useMemo(() => {
      // Checking if renderElement is well defined or not as calling SDK has a number of video streams limitation which
      // implies that, after their threshold, all streams have no child (blank video)
      if (!renderElement || !renderElement.childElementCount) {
        // Returning `undefined` results in the placeholder with avatar being shown
        return undefined;
      }

      return <StreamMedia videoStreamElement={renderElement} styles={screenShareVideoStyles} />;
    }, [renderElement]);

    if (!localParticipant || !localParticipant.isScreenSharingOn) {
      return null;
    }

    return (
      <VideoTile
        displayName={localVideoLabel}
        isMuted={localParticipant?.isMuted}
        onRenderPlaceholder={() => (
          <LocalScreenSharingNotification message={locale.strings.videoGallery.screenIsBeingSharedMessage} />
        )}
        renderElement={renderVideoStreamElement}
      />
    );
  }
);

const LocalScreenSharingNotification = (props: { message: string }): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign="center" verticalAlign="center" className={screenSharingContainerStyle}>
      <Stack
        horizontalAlign="center"
        verticalAlign="center"
        className={screenSharingNotificationContainerStyle(theme)}
        tokens={{ childrenGap: '1rem' }}
      >
        <Stack horizontal verticalAlign="center" className={screenSharingNotificationIconContainerStyle}>
          <Icon iconName="ControlButtonScreenShareStart" className={screenSharingNotificationIconStyle(theme)} />
        </Stack>
        <Text className={screenSharingNotificationTextStyle} aria-live="polite">
          {props.message}
        </Text>
      </Stack>
    </Stack>
  );
};

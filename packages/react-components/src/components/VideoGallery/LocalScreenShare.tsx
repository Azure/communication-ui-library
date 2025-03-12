// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, Stack, Text } from '@fluentui/react';
import React, { useEffect } from 'react';
import { useLocale } from '../../localization';
import { useTheme } from '../../theming';
import { CreateVideoStreamViewResult, VideoGalleryLocalParticipant, VideoStreamOptions } from '../../types';
import { VideoTile } from '../VideoTile';
import { StreamMedia } from '../StreamMedia';
import { LoadingSpinner } from './RemoteScreenShare';
import { _formatString } from '@internal/acs-ui-common';
import {
  screenSharingContainerStyle,
  screenSharingNotificationContainerStyle,
  screenSharingNotificationIconContainerStyle,
  screenSharingNotificationIconStyle,
  screenSharingNotificationTextStyle
} from './styles/LocalScreenShare.styles';

/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const LocalScreenShare = React.memo(
  (props: {
    localParticipant: VideoGalleryLocalParticipant;
    renderElement?: HTMLElement;
    isAvailable?: boolean;
    onCreateLocalStreamView?: (options?: VideoStreamOptions) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeLocalScreenShareStreamView?: () => Promise<void>;
    localScreenShareView?: 'stream' | 'placeholderMessage';
  }) => {
    const {
      localParticipant,
      renderElement,
      isAvailable,
      onCreateLocalStreamView,
      onDisposeLocalScreenShareStreamView,
      localScreenShareView = 'stream'
    } = props;
    const locale = useLocale();
    const theme = useTheme();
    if (!renderElement && localScreenShareView === 'stream') {
      onCreateLocalStreamView && onCreateLocalStreamView();
    }

    useEffect(() => {
      return () => {
        // TODO: Isolate disposing behaviors for screenShare and videoStream
        onDisposeLocalScreenShareStreamView && onDisposeLocalScreenShareStreamView();
      };
    }, [onDisposeLocalScreenShareStreamView]);

    if (!localParticipant || !localParticipant.isScreenSharingOn) {
      return null;
    }
    const localScreenSharingPlaceholder = (
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
            {locale.strings.videoGallery.screenIsBeingSharedMessage}
          </Text>
        </Stack>
      </Stack>
    );

    const displayName = !localParticipant?.displayName
      ? locale.strings.videoGallery.displayNamePlaceholder
      : localParticipant?.displayName;

    const loadingMessage = locale.strings.videoGallery.localScreenShareLoadingMessage;

    if (localScreenShareView === 'placeholderMessage') {
      return (
        <VideoTile displayName={displayName} isMuted={localParticipant?.isMuted} onRenderPlaceholder={() => <></>}>
          {localScreenSharingPlaceholder}
        </VideoTile>
      );
    }

    return (
      <VideoTile
        displayName={displayName}
        isMuted={localParticipant?.isMuted}
        renderElement={
          renderElement ? (
            <StreamMedia videoStreamElement={renderElement} loadingState={isAvailable === false ? 'loading' : 'none'} />
          ) : undefined
        }
        onRenderPlaceholder={() => <LoadingSpinner loadingMessage={loadingMessage} />}
        mediaAccess={localParticipant.mediaAccess}
      />
    );
  }
);

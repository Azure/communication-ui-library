// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Stack, Text } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';
import { useTheme } from '../../theming';
import { VideoGalleryLocalParticipant } from '../../types';
import { VideoTile } from '../VideoTile';
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
export const LocalScreenShare = React.memo((props: { localParticipant: VideoGalleryLocalParticipant }) => {
  const { localParticipant } = props;

  const theme = useTheme();
  const locale = useLocale();

  if (!localParticipant || !localParticipant.isScreenSharingOn) {
    return null;
  }

  const localScreenSharingNotification = (
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

  return (
    <VideoTile
      displayName={localParticipant?.displayName}
      isMuted={localParticipant?.isMuted}
      onRenderPlaceholder={() => <></>}
    >
      {localScreenSharingNotification}
    </VideoTile>
  );
});

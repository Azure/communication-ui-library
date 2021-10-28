// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, Stack, Text } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../../localization';
import { useTheme } from '../../theming';
import { VideoGalleryLocalParticipant } from '../../types';
import { VideoTile } from '../VideoTile';
import {
  screenSharingContainer,
  screenSharingNotificationContainer,
  screenSharingNotificationIconContainer,
  screenSharingNotificationIconStyle,
  screenSharingNotificationTextStyle
} from './styles/LocalScreenShare.styles';

/**
 * All strings that may be shown on the UI in the {@link LocalScreenShare}.
 *
 * @public
 */
export interface LocalScreenShareStrings {
  screenSharingMessage: string;
}

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
    <Stack horizontalAlign={'center'} verticalAlign={'center'} className={screenSharingContainer}>
      <Stack
        horizontalAlign={'center'}
        verticalAlign={'center'}
        className={screenSharingNotificationContainer(theme)}
        tokens={{ childrenGap: '1rem' }}
      >
        <Stack horizontal verticalAlign={'center'} className={screenSharingNotificationIconContainer}>
          <Icon iconName="ControlButtonScreenShareStart" className={screenSharingNotificationIconStyle(theme)} />
        </Stack>
        <Text className={screenSharingNotificationTextStyle} aria-live={'polite'}>
          {locale.strings.localScreenShare.screenSharingMessage}
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

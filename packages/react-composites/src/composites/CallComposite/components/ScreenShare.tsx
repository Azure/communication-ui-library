// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, mergeStyles, Spinner, SpinnerSize, Stack, Text } from '@fluentui/react';
import { _formatString, memoizeFnAll } from '@internal/acs-ui-common';
import React, { useMemo } from 'react';
import {
  StreamMedia,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  VideoTile,
  useTheme
} from '@internal/react-components';
import { useLocale } from '../../localization';
import {
  aspectRatioBoxContentStyle,
  aspectRatioBoxStyle,
  screenShareContainerStyle,
  stackContainerStyle,
  stackContainerParticipantVideoStyles
} from '../styles/MediaGallery.styles';
import {
  loadingStyle,
  videoStreamStyle,
  videoWithNoRoundedBorderStyle,
  screenSharingContainer,
  screenSharingNotificationContainer,
  screenSharingNotificationIconContainer,
  screenSharingNotificationIconStyle,
  screenSharingNotificationTextStyle
} from '../styles/ScreenShare.styles';

/**
 * @private
 */
export type ScreenShareProps = {
  screenShareParticipant: VideoGalleryRemoteParticipant | undefined;
  localParticipant?: VideoGalleryLocalParticipant;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  onCreateLocalStreamView?: () => Promise<void>;
  onCreateRemoteStreamView?: (userId: string, options?: VideoStreamOptions) => Promise<void>;
};

const memoizeAllRemoteParticipants = memoizeFnAll(
  (
    userId: string,
    isMuted?: boolean,
    isSpeaking?: boolean,
    renderElement?: HTMLElement,
    displayName?: string
  ): JSX.Element => {
    const videoStyles = isSpeaking ? videoWithNoRoundedBorderStyle : {};

    return (
      <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={userId}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            styles={stackContainerParticipantVideoStyles}
            userId={userId}
            renderElement={
              renderElement ? <StreamMedia styles={videoStyles} videoStreamElement={renderElement} /> : undefined
            }
            displayName={displayName}
            isMuted={isMuted}
            isSpeaking={isSpeaking}
          />
        </Stack>
      </Stack>
    );
  }
);

// A non-undefined display name is needed for this render, and that is coming from VideoTile props below
const onRenderPlaceholder = (options, strings): JSX.Element => (
  <div className={loadingStyle}>
    <Spinner
      label={_formatString(strings.sharingScreenLoading, { sharingUser: `${options?.text}` })}
      size={SpinnerSize.xSmall}
    />
  </div>
);

/**
 * @private
 */
export const ScreenShare = (props: ScreenShareProps): JSX.Element => {
  const {
    screenShareParticipant,
    localParticipant,
    remoteParticipants,
    onCreateRemoteStreamView,
    onCreateLocalStreamView
  } = props;

  const theme = useTheme();
  const locale = useLocale();

  const localVideoStream = localParticipant?.videoStream;
  const isScreenShareAvailable =
    screenShareParticipant &&
    screenShareParticipant.screenShareStream &&
    screenShareParticipant.screenShareStream.isAvailable;

  const localScreenSharingNotification = useMemo((): JSX.Element | undefined => {
    if (!localParticipant || !localParticipant.isScreenSharingOn) {
      return undefined;
    }

    return (
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
            {locale.strings.call.screenSharingMessage}
          </Text>
        </Stack>
      </Stack>
    );
  }, [
    localParticipant?.isScreenSharingOn,
    localParticipant?.videoStream,
    localParticipant?.videoStream?.renderElement,
    theme
  ]);

  const localScreenShareStreamComponent = useMemo(() => {
    return (
      <VideoTile
        displayName={localParticipant?.displayName}
        isMuted={localParticipant?.isMuted}
        renderElement={undefined}
        onRenderPlaceholder={() => <></>}
      >
        {localScreenSharingNotification}
      </VideoTile>
    );
  }, [isScreenShareAvailable, onCreateRemoteStreamView, screenShareParticipant, localParticipant?.isScreenSharingOn]);

  const screenShareStreamComponent = useMemo(() => {
    if (!isScreenShareAvailable) {
      return;
    }
    const screenShareStream = screenShareParticipant?.screenShareStream;
    const videoStream = screenShareParticipant?.videoStream;
    if (screenShareStream?.isAvailable && !screenShareStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }
    if (videoStream?.isAvailable && !videoStream?.renderElement) {
      screenShareParticipant && onCreateRemoteStreamView && onCreateRemoteStreamView(screenShareParticipant.userId);
    }

    const videoStyles = screenShareParticipant?.isSpeaking ? videoWithNoRoundedBorderStyle : {};

    return (
      <VideoTile
        displayName={screenShareParticipant?.displayName}
        isMuted={screenShareParticipant?.isMuted}
        isSpeaking={screenShareParticipant?.isSpeaking}
        renderElement={
          screenShareStream?.renderElement ? (
            <StreamMedia styles={videoStyles} videoStreamElement={screenShareStream?.renderElement} />
          ) : undefined
        }
        onRenderPlaceholder={(userId, options) => onRenderPlaceholder(options, locale.strings.call)}
        styles={{
          overlayContainer: videoStreamStyle
        }}
      />
    );
  }, [isScreenShareAvailable, onCreateRemoteStreamView, screenShareParticipant]);

  const sidePanelLocalParticipant = useMemo(() => {
    if (localVideoStream && !localVideoStream?.renderElement) {
      onCreateLocalStreamView && onCreateLocalStreamView();
    }

    return (
      <VideoTile
        styles={stackContainerParticipantVideoStyles}
        isMuted={localParticipant?.isMuted}
        renderElement={
          localVideoStream?.renderElement ? (
            <StreamMedia videoStreamElement={localVideoStream?.renderElement} />
          ) : undefined
        }
        displayName={localParticipant?.displayName}
      />
    );
  }, [localParticipant, localVideoStream, onCreateLocalStreamView]);

  const sidePanelRemoteParticipants = useMemo(() => {
    return memoizeAllRemoteParticipants((memoizedRemoteParticipantFn) => {
      return remoteParticipants
        ? remoteParticipants.map((participant: VideoGalleryRemoteParticipant) => {
            const remoteVideoStream = participant.videoStream;

            if (remoteVideoStream?.isAvailable && !remoteVideoStream?.renderElement) {
              onCreateRemoteStreamView && onCreateRemoteStreamView(participant.userId);
            }

            return memoizedRemoteParticipantFn(
              participant.userId,
              participant.isMuted,
              participant.isSpeaking,
              remoteVideoStream?.renderElement,
              participant.displayName
            );
          })
        : [];
    });
  }, [remoteParticipants, onCreateRemoteStreamView]);

  return (
    <Stack horizontal verticalFill>
      <Stack.Item className={stackContainerStyle}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>{sidePanelLocalParticipant}</Stack>
          </Stack>
          {sidePanelRemoteParticipants}
        </Stack>
      </Stack.Item>
      <Stack.Item className={screenShareContainerStyle}>
        {localParticipant?.isScreenSharingOn ? localScreenShareStreamComponent : screenShareStreamComponent}
      </Stack.Item>
    </Stack>
  );
};

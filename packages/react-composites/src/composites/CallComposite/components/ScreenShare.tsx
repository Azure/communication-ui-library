// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { memoizeFnAll } from '@internal/acs-ui-common';
import { mergeStyles, Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  OnRenderAvatarCallback,
  StreamMedia,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant,
  VideoStreamOptions,
  VideoTile
} from '@internal/react-components';
import {
  aspectRatioBoxContentStyle,
  aspectRatioBoxStyle,
  screenShareContainerStyle,
  stackContainerStyle,
  stackContainerParticipantVideoStyles
} from '../styles/MediaGallery.styles';
import { loadingStyle, videoStreamStyle } from '../styles/ScreenShare.styles';
import { CursorCanvas, CursorData } from './CursorCanvas';
import { CursorChatFluidModel } from '../../MeetingComposite/FluidModel';
import murmur from 'murmurhash-js';

/**
 * @private
 */
export type ScreenShareProps = {
  fluidModel?: CursorChatFluidModel;
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
    return (
      <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle} key={userId}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile
            styles={stackContainerParticipantVideoStyles}
            userId={userId}
            renderElement={renderElement ? <StreamMedia videoStreamElement={renderElement} /> : undefined}
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
const onRenderPlaceholder: OnRenderAvatarCallback = (userId, options): JSX.Element => (
  <div className={loadingStyle}>
    <Spinner label={`Loading ${options?.text}'s screen`} size={SpinnerSize.xSmall} />
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

  const localVideoStream = localParticipant?.videoStream;
  const isScreenShareAvailable =
    screenShareParticipant &&
    screenShareParticipant.screenShareStream &&
    screenShareParticipant.screenShareStream.isAvailable;

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

    return (
      <VideoTile
        displayName={screenShareParticipant?.displayName}
        isMuted={screenShareParticipant?.isMuted}
        isSpeaking={screenShareParticipant?.isSpeaking}
        renderElement={
          screenShareStream?.renderElement ? (
            <StreamMedia videoStreamElement={screenShareStream?.renderElement} />
          ) : undefined
        }
        onRenderPlaceholder={onRenderPlaceholder}
        styles={{
          overlayContainer: videoStreamStyle
        }}
      >
        {videoStream && videoStream.isAvailable && videoStream.renderElement && (
          <Stack horizontalAlign="center" verticalAlign="center" className={aspectRatioBoxStyle}>
            <Stack className={aspectRatioBoxContentStyle}>
              <VideoTile
                displayName={screenShareParticipant?.displayName}
                isMuted={screenShareParticipant?.isMuted}
                renderElement={
                  videoStream.renderElement ? <StreamMedia videoStreamElement={videoStream.renderElement} /> : undefined
                }
              />
            </Stack>
          </Stack>
        )}
      </VideoTile>
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
      return remoteParticipants && screenShareParticipant
        ? remoteParticipants
            .filter((remoteParticipant: VideoGalleryRemoteParticipant) => {
              return remoteParticipant.userId !== screenShareParticipant.userId;
            })
            .map((participant: VideoGalleryRemoteParticipant) => {
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
  }, [remoteParticipants, onCreateRemoteStreamView, screenShareParticipant]);

  const [cursorState, setCursorState] = useState<CursorData[]>([]);
  useEffect(() => {
    props.fluidModel?.on('cursorsChanged', () => {
      if (props.fluidModel) {
        setCursorState(
          Object.values(props.fluidModel.reducedCursors).map((value) => ({
            posX: value.x,
            posY: value.y,
            message: value.text,
            name: value.displayName,
            color: pickColor(value.displayName),
            mine: value.mine
          }))
        );
      }
    });
  }, [props.fluidModel]);

  const [isEditing, setIsEditing] = useState<boolean>(false);

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
      <Stack.Item
        onMouseMove={(ev) => {
          const mouseX = (ev.clientX - ev.currentTarget.offsetLeft) / ev.currentTarget.offsetWidth;
          const mouseY = (ev.clientY - ev.currentTarget.offsetTop) / ev.currentTarget.offsetHeight;
          console.log('Sending cursor position', mouseX, mouseY);
          props.fluidModel?.setCursorPosition(mouseX, mouseY);
        }}
        className={screenShareContainerStyle}
        onMouseUp={() => {
          console.log('on mouse up called');
          setIsEditing(!isEditing);
        }}
      >
        <>
          {screenShareStreamComponent}
          <Stack style={{ height: '100%', width: '100%', position: 'absolute', top: '0', pointerEvents: 'none' }}>
            <CursorCanvas
              cursors={cursorState}
              isEditingChatBubble={isEditing}
              onTextFieldEnterPressed={function (): void {
                setIsEditing(!isEditing);
              }}
              onTextFieldChanged={function (text: string): void {
                console.log('sendingText: ', text);
                props.fluidModel?.setText(text);
              }}
            />
          </Stack>
        </>
      </Stack.Item>
    </Stack>
  );
};

const pickColor = (name: string): string => {
  return colorPalette[murmur.murmur3(name) % colorPalette.length];
  // return colorPalette[(name.length + (name.length > 0 ? name.charCodeAt(0) : 0)) % colorPalette.length];
};
const colorPalette = ['#d0fffe', '#fffddb', '#e4ffde', '#ffd3fd', '#ffe7d3'];

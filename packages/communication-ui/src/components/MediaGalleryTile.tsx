// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { mediaContainer, videoHint, disabledVideoHint, mediaPersonaStyle } from './styles/MediaGalleryTile.styles';

import { Label, Persona, PersonaSize, Stack } from '@fluentui/react';
import { StreamMediaComponent } from './StreamMedia';
import { ErrorHandlingProps } from '../providers/ErrorProvider';
import { WithErrorHandling } from '../utils/WithErrorHandling';

export interface MediaGalleryTileProps {
  /** Optional label for the media gallery tile. */
  label?: string;
  /** Optional avatar name for the media gallery tile. */
  avatarName?: string;
  /** Determines if the static image or video stream should be rendered. */
  isVideoReady: boolean;
  /** Determines if the video is mirrored or not */
  invertVideo?: boolean;
  /** Determines the actual video stream element to render. */
  videoStreamElement: HTMLElement | null;
  /** Optional property to set the aria label of the media gallery tile if there is no available stream. */
  noVideoAvailableAriaLabel?: string;
  /** Optional callback to render stream media. */
  onRenderStreamMedia?: (isVideoReady: boolean, videoStreamElement: HTMLElement | null) => JSX.Element;
  /** Optional element to render if the stream in unavailable */
  fallbackElement?: JSX.Element;
}

const MediaGalleryTileComponentBase = (props: MediaGalleryTileProps & ErrorHandlingProps): JSX.Element => {
  const {
    label,
    avatarName,
    onRenderStreamMedia,
    isVideoReady,
    videoStreamElement,
    fallbackElement,
    noVideoAvailableAriaLabel,
    invertVideo
  } = props;

  return (
    <Stack className={mediaContainer} grow>
      {onRenderStreamMedia ? (
        onRenderStreamMedia(isVideoReady, videoStreamElement)
      ) : isVideoReady ? (
        <StreamMediaComponent invertVideo={invertVideo} videoStreamElement={videoStreamElement} />
      ) : fallbackElement ? (
        { ...fallbackElement }
      ) : (
        <Stack className={mediaPersonaStyle}>
          <Persona
            text={avatarName}
            size={PersonaSize.size100}
            hidePersonaDetails={true}
            aria-label={noVideoAvailableAriaLabel}
          />
        </Stack>
      )}
      {label && <Label className={isVideoReady ? videoHint : disabledVideoHint}>{label}</Label>}
    </Stack>
  );
};

export const MediaGalleryTileComponent = (props: MediaGalleryTileProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(MediaGalleryTileComponentBase, props);

// © Microsoft Corporation. All rights reserved.

import { IStyle, mergeStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import React from 'react';
import { rootStyles, videoContainerStyles } from './styles/VideoTile.styles';

export interface VideoTileStylesProps {
  /** Styles for the root container */
  root?: IStyle;
  /** Styles for video container */
  videoContainer?: IStyle;
  /** Styles for container overlayed on the video container */
  overlayContainer?: IStyle;
}

export interface VideoTileProps {
  /** React Child components. */
  children?: React.ReactNode;
  /** Custom styles */
  styles?: VideoTileStylesProps;
  /** Determines if the static image or video stream should be rendered. */
  isVideoReady?: boolean;
  /** Determines the actual video stream element to render. */
  videoProvider: () => JSX.Element | null;
  /** Determines if the video is mirrored or not */
  invertVideo?: boolean;
  /** Custom Component to render when no video is available. Defaults to a Persona Icon */
  placeholderProvider?: () => JSX.Element | null;
}

interface PlaceholderProps {
  /** Optional participant avatar name for the VideoTile default placeholder. */
  avatarName?: string;
  /** Optional property to set the aria label of the video tile if there is no available stream. */
  noVideoAvailableAriaLabel?: string;
}

const DefaultPlaceholder = (props: PlaceholderProps): JSX.Element => {
  const { avatarName, noVideoAvailableAriaLabel } = props;
  return (
    <Stack style={{ position: 'absolute', left: '50%', bottom: '50%' }}>
      <Persona
        styles={{ root: { position: 'relative', left: '-50%', bottom: '-50%' } }}
        size={PersonaSize.size100}
        hidePersonaDetails={true}
        text={avatarName}
        aria-label={noVideoAvailableAriaLabel}
      />
    </Stack>
  );
};

export const VideoTile = (props: VideoTileProps & PlaceholderProps): JSX.Element => {
  const { styles, isVideoReady, videoProvider, placeholderProvider } = props;
  const placeholder = (placeholderProvider && placeholderProvider()) ?? <DefaultPlaceholder {...props} />;
  return (
    <Stack className={mergeStyles(rootStyles, styles?.root)}>
      {isVideoReady ? (
        <Stack className={mergeStyles(videoContainerStyles, styles?.videoContainer)}>{videoProvider()}</Stack>
      ) : (
        placeholder
      )}
      <Stack className={mergeStyles(styles?.overlayContainer)}>{props.children}</Stack>
    </Stack>
  );
};

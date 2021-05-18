// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, Persona, PersonaSize, Stack } from '@fluentui/react';
import React from 'react';
import { rootStyles, videoContainerStyles, overlayContainerStyles } from './styles/VideoTile.styles';
import { useTheme } from '@fluentui/react-theme-provider';
import { BaseCustomStylesProps } from '../types';

export interface VideoTileStylesProps extends BaseCustomStylesProps {
  /** Styles for video container. */
  videoContainer?: IStyle;
  /** Styles for container overlayed on the video container. */
  overlayContainer?: IStyle;
}

/**
 * Props for VideoTile component
 */
export interface VideoTileProps {
  /** React Child components. Child Components will show as overlay component in the VideoTile. */
  children?: React.ReactNode;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * @Example
   * ```
   * <VideoTile styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: VideoTileStylesProps;
  /** Determines if the static image or video stream should be rendered. */
  isVideoReady?: boolean;
  /** Component with the video stream. */
  renderElement?: JSX.Element | null;
  /** Determines if the video is mirrored or not. */
  isMirrored?: boolean;
  /** Custom Component to render when no video is available. Defaults to a Persona Icon. */
  placeholder?: JSX.Element | null;
}

export interface PlaceholderProps {
  /** Optional participant display name for the VideoTile default placeholder. */
  displayName?: string;
  /** Optional property to set the aria label of the video tile if there is no available stream. */
  noVideoAvailableAriaLabel?: string;
}

const DefaultPlaceholder = (props: PlaceholderProps): JSX.Element => {
  const { displayName, noVideoAvailableAriaLabel } = props;
  const personaStyles = { root: { margin: 'auto' } };
  return (
    <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
      <Persona
        styles={personaStyles}
        size={PersonaSize.size100}
        hidePersonaDetails={true}
        text={displayName}
        initialsTextColor="white"
        aria-label={noVideoAvailableAriaLabel}
      />
    </Stack>
  );
};

export const VideoTile = (props: VideoTileProps & PlaceholderProps): JSX.Element => {
  const { styles, isVideoReady, renderElement, placeholder, isMirrored, children } = props;
  const theme = useTheme();
  return (
    <Stack className={mergeStyles(rootStyles, { background: theme.palette.neutralLighter }, styles?.root)}>
      {isVideoReady && renderElement ? (
        <Stack
          className={mergeStyles(
            videoContainerStyles,
            isMirrored && {
              transform: 'scaleX(-1)'
            },
            styles?.videoContainer
          )}
        >
          {renderElement}
        </Stack>
      ) : (
        <Stack className={mergeStyles(videoContainerStyles)}>{placeholder ?? <DefaultPlaceholder {...props} />}</Stack>
      )}
      {children && <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>{children}</Stack>}
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  DefaultPalette as palette,
  IStyle,
  mergeStyles,
  Persona,
  PersonaSize,
  Stack,
  Text,
  useTheme
} from '@fluentui/react';
import React from 'react';
import {
  disabledVideoHint,
  overlayContainerStyles,
  rootStyles,
  videoContainerStyles,
  videoHint
} from './styles/VideoTile.styles';
import { BaseCustomStylesProps } from '../types';

export interface VideoTileStylesProps extends BaseCustomStylesProps {
  /** Styles for video container. */
  videoContainer?: IStyle;
  /** Styles for container overlayed on the video container. */
  overlayContainer?: IStyle;
  /** Styles for displayName on the video container. */
  displayNameContainer?: IStyle;
}

/**
 * Props for VideoTile component
 */
export interface VideoTileProps extends PlaceholderProps {
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
  /** Custom render Component function for no video is available. Render a Persona Icon if undefined. */
  onRenderPlaceholder?: (
    props: PlaceholderProps,
    defaultOnRender: (props: PlaceholderProps) => JSX.Element
  ) => JSX.Element | null;
  /**
   * Whether the displayName is displayed or not.
   *
   * @defaultValue `true`
   */
  showDisplayName?: boolean;
}

export interface PlaceholderProps {
  /** user id for the VideoTile placeholder. */
  userId?: string;
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

export const VideoTile = (props: VideoTileProps): JSX.Element => {
  const {
    children,
    displayName,
    isMirrored,
    isVideoReady,
    onRenderPlaceholder,
    renderElement,
    showDisplayName = true,
    styles,
    userId,
    noVideoAvailableAriaLabel
  } = props;

  const placeHolderProps = { userId, displayName, noVideoAvailableAriaLabel };
  const theme = useTheme();
  const displayVideo = isVideoReady && !!renderElement;

  return (
    <Stack className={mergeStyles(rootStyles, { background: theme.palette.neutralLighter }, styles?.root)}>
      {displayVideo ? (
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
        <Stack className={mergeStyles(videoContainerStyles)}>
          {onRenderPlaceholder ? (
            onRenderPlaceholder(placeHolderProps, DefaultPlaceholder)
          ) : (
            <DefaultPlaceholder {...placeHolderProps} />
          )}
        </Stack>
      )}
      {displayName && showDisplayName && (
        <Text
          className={mergeStyles(
            displayVideo ? videoHint : disabledVideoHint,
            // when video is on, the displayName has a grey-ish background, so no use of theme
            { color: displayVideo ? palette.neutralPrimary : theme.palette.neutralPrimary },
            styles?.displayNameContainer
          )}
        >
          {displayName}
        </Text>
      )}
      {children && <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>{children}</Stack>}
    </Stack>
  );
};

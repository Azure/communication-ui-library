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
  displayNameStyle,
  overlayContainerStyles,
  rootStyles,
  videoContainerStyles,
  videoHint
} from './styles/VideoTile.styles';
import { BaseCustomStylesProps } from '../types';
import { MicIcon, MicOffIcon } from '@fluentui/react-northstar';

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
  isVideoReady?: boolean | undefined;
  /** Component with the video stream. */
  renderElement?: JSX.Element | null | undefined;
  /** Determines if the video is mirrored or not. */
  isMirrored?: boolean;
  /** Custom render Component function for no video is available. Render a Persona Icon if undefined. */
  onRenderPlaceholder?:
    | ((props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element | null)
    | undefined;
  /**
   * Whether to display a mute icon beside the user's display name.
   */
  showMuteIndicator?: boolean | undefined;
  /**
   * Whether the video is muted or not.
   */
  isMuted?: boolean | undefined;
}

export interface PlaceholderProps {
  /** user id for the VideoTile placeholder. */
  userId?: string | undefined;
  /** Optional participant display name for the VideoTile default placeholder. */
  displayName?: string | undefined;
  /** Optional property to set the aria label of the video tile if there is no available stream. */
  noVideoAvailableAriaLabel?: string | undefined;
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
        text={displayName ?? ''}
        initialsTextColor="white"
        aria-label={noVideoAvailableAriaLabel ?? ''}
      />
    </Stack>
  );
};

export const VideoTile = (props: VideoTileProps): JSX.Element => {
  const {
    children,
    displayName,
    isMirrored,
    isMuted,
    isVideoReady,
    onRenderPlaceholder,
    renderElement,
    showMuteIndicator = true,
    styles,
    userId,
    noVideoAvailableAriaLabel
  } = props;

  const placeHolderProps = { userId, displayName, noVideoAvailableAriaLabel };
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
        <Stack className={mergeStyles(videoContainerStyles)}>
          {onRenderPlaceholder ? (
            onRenderPlaceholder(placeHolderProps, DefaultPlaceholder)
          ) : (
            <DefaultPlaceholder {...placeHolderProps} />
          )}
        </Stack>
      )}

      <Stack
        horizontal
        className={mergeStyles(
          isVideoReady ? videoHint : disabledVideoHint,
          // when video is on, the displayName has a grey-ish background, so no use of theme
          { color: isVideoReady ? palette.neutralPrimary : theme.palette.neutralPrimary },
          styles?.displayNameContainer
        )}
      >
        <Stack.Item>
          {displayName && (
            <Text
              className={mergeStyles(displayNameStyle, {
                color: isVideoReady ? palette.neutralPrimary : theme.palette.neutralPrimary
              })}
            >
              {displayName}
            </Text>
          )}
        </Stack.Item>
        <Stack.Item>
          {showMuteIndicator &&
            isMuted !== undefined &&
            (isMuted ? <MicOffIcon size="small" /> : <MicIcon size="small" />)}
        </Stack.Item>
      </Stack>

      {children && <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>{children}</Stack>}
    </Stack>
  );
};

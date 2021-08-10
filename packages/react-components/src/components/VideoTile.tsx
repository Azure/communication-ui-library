// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, IStyle, mergeStyles, Persona, Stack, Text } from '@fluentui/react';
import { Ref } from '@fluentui/react-northstar';
import { MicOn16Filled, MicOff16Filled } from '@fluentui/react-icons';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  disabledVideoHint,
  displayNameStyle,
  iconContainerStyle,
  overlayContainerStyles,
  rootStyles,
  videoContainerStyles,
  videoHint
} from './styles/VideoTile.styles';
import { BaseCustomStylesProps } from '../types';
import { useTheme } from '../theming';

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
   * Whether to display a mute icon beside the user's display name.
   */
  showMuteIndicator?: boolean;
  /**
   * Whether the video is muted or not.
   */
  isMuted?: boolean;
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
  const personaRef = useRef<HTMLElement>(null);
  const [coinSize, setCoinSize] = useState(100);
  const personaStyles = { root: { margin: 'auto', maxHeight: '50%' } };

  useLayoutEffect(() => {
    if (personaRef.current) {
      setCoinSize(personaRef.current.clientHeight);
    }
  }, [props]);

  return (
    <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
      <Ref innerRef={personaRef}>
        <Persona
          styles={personaStyles}
          coinSize={coinSize}
          hidePersonaDetails={true}
          text={displayName ?? ''}
          initialsTextColor="white"
          aria-label={noVideoAvailableAriaLabel ?? ''}
        />
      </Ref>
    </Stack>
  );
};

export const VideoTile = (props: VideoTileProps): JSX.Element => {
  const {
    children,
    displayName,
    isMirrored,
    isMuted,
    onRenderPlaceholder,
    renderElement,
    showMuteIndicator = true,
    styles,
    userId,
    noVideoAvailableAriaLabel
  } = props;

  const placeHolderProps = { userId, displayName, noVideoAvailableAriaLabel };
  const theme = useTheme();

  const isVideoRendered = !!renderElement;

  return (
    <Stack className={mergeStyles(rootStyles, { background: theme.palette.neutralLighter }, styles?.root)}>
      {isVideoRendered ? (
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
          isVideoRendered ? videoHint : disabledVideoHint,
          // when video is being rendered, the displayName has a grey-ish background, so no use of theme
          { color: isVideoRendered ? palette.neutralPrimary : theme.palette.neutralPrimary },
          styles?.displayNameContainer
        )}
      >
        <Stack>
          {displayName && (
            <Text
              className={mergeStyles(displayNameStyle, {
                color: isVideoRendered ? palette.neutralPrimary : theme.palette.neutralPrimary
              })}
            >
              {displayName}
            </Text>
          )}
        </Stack>
        <Stack className={mergeStyles(iconContainerStyle)}>
          {showMuteIndicator &&
            isMuted !== undefined &&
            (isMuted ? (
              <MicOff16Filled primaryFill="currentColor" key={'microphoneOffIconKey'} />
            ) : (
              <MicOn16Filled primaryFill="currentColor" key={'microphoneIconKey'} />
            ))}
        </Stack>
      </Stack>

      {children && <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>{children}</Stack>}
    </Stack>
  );
};

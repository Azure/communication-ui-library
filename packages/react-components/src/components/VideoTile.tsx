// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultPalette as palette, Icon, IStyle, mergeStyles, Persona, Stack, Text } from '@fluentui/react';
import { Ref } from '@fluentui/react-northstar';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { useTheme } from '../theming';
import { BaseCustomStylesProps, CustomAvatarOptions, OnRenderAvatarCallback } from '../types';
import {
  disabledVideoHint,
  displayNameStyle,
  iconContainerStyle,
  isSpeakingStyles,
  overlayContainerStyles,
  rootStyles,
  videoContainerStyles,
  videoHint
} from './styles/VideoTile.styles';

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
  /** user id for the VideoTile placeholder. */
  userId?: string;
  /** Component with the video stream. */
  renderElement?: JSX.Element | null;
  /** Determines if the video is mirrored or not. */
  isMirrored?: boolean;
  /** Custom render Component function for no video is available. Render a Persona Icon if undefined. */
  onRenderPlaceholder?: OnRenderAvatarCallback;
  /**
   * Whether to display a mute icon beside the user's display name.
   */
  showMuteIndicator?: boolean;
  /**
   * Whether the video is muted or not.
   */
  isMuted?: boolean;
  /**
   * Display Name of the Participant
   */
  displayName?: string;
  /** Optional property to set the aria label of the video tile if there is no available stream. */
  noVideoAvailableAriaLabel?: string;
  /** Whether the participant in the videoTile is speaking. Shows a speaking indicator (border). */
  isSpeaking?: boolean;
}

// Coin max size is set to 100px (PersonaSize.size100)
const personaMaxSize = 200;

const DefaultPlaceholder = (props: CustomAvatarOptions): JSX.Element => {
  const { text, noVideoAvailableAriaLabel, coinSize, styles, hidePersonaDetails } = props;

  return (
    <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
      <Persona
        styles={styles}
        coinSize={coinSize}
        hidePersonaDetails={hidePersonaDetails}
        text={text ?? ''}
        initialsTextColor="white"
        aria-label={noVideoAvailableAriaLabel ?? ''}
      />
    </Stack>
  );
};

const defaultPersonaStyles = { root: { margin: 'auto', maxHeight: '100%' } };

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
    noVideoAvailableAriaLabel,
    isSpeaking
  } = props;

  const [personaSize, setPersonaSize] = useState(100);
  const videoTileRef = useRef<HTMLElement>(null);

  const theme = useTheme();

  const isVideoRendered = !!renderElement;

  useLayoutEffect(() => {
    if (videoTileRef.current && videoTileRef.current) {
      const minSize = Math.min(videoTileRef.current.clientHeight, videoTileRef.current.clientWidth, personaMaxSize);
      setPersonaSize(minSize / 2);
    }
  }, [videoTileRef.current?.clientHeight, videoTileRef.current?.clientWidth]);

  const placeholderOptions = {
    userId,
    text: displayName,
    noVideoAvailableAriaLabel,
    coinSize: personaSize,
    styles: defaultPersonaStyles,
    hidePersonaDetails: true
  };

  return (
    <Ref innerRef={videoTileRef}>
      <Stack
        className={mergeStyles(
          rootStyles,
          isSpeaking ? isSpeakingStyles : {},
          { background: theme.palette.neutralLighter },
          styles?.root
        )}
      >
        {isVideoRendered ? (
          <Stack
            className={mergeStyles(
              videoContainerStyles,
              isMirrored && { transform: 'scaleX(-1)' },
              styles?.videoContainer
            )}
          >
            {renderElement}
          </Stack>
        ) : (
          <Stack className={mergeStyles(videoContainerStyles)}>
            {onRenderPlaceholder ? (
              onRenderPlaceholder(userId ?? '', placeholderOptions, DefaultPlaceholder)
            ) : (
              <DefaultPlaceholder {...placeholderOptions} />
            )}
          </Stack>
        )}

        {(displayName || showMuteIndicator) && (
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
                (isMuted ? <Icon iconName="VideoTileMicOff" /> : <Icon iconName="VideoTileMicOn" />)}
            </Stack>
          </Stack>
        )}

        {children && (
          <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>{children}</Stack>
        )}
      </Stack>
    </Ref>
  );
};

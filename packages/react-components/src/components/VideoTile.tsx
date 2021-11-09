// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, IStyle, mergeStyles, Persona, Stack, Text } from '@fluentui/react';
import { Ref } from '@fluentui/react-northstar';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useIdentifiers } from '../identifiers';
import { useTheme } from '../theming';
import { BaseCustomStyles, CustomAvatarOptions, OnRenderAvatarCallback } from '../types';
import {
  disabledVideoHint,
  displayNameStyle,
  iconContainerStyle,
  overlayContainerStyles,
  rootStyles,
  tileInfoStackItemStyle,
  videoContainerStyles,
  videoHint
} from './styles/VideoTile.styles';
import { getVideoTileOverrideColor } from './utils/videoTileStylesUtils';

/**
 * Fluent styles for {@link VideoTile}.
 *
 * @public
 */
export interface VideoTileStylesProps extends BaseCustomStyles {
  /** Styles for video container. */
  videoContainer?: IStyle;
  /** Styles for container overlayed on the video container. */
  overlayContainer?: IStyle;
  /** Styles for displayName on the video container. */
  displayNameContainer?: IStyle;
}

/**
 * Props for {@link VideoTile}.
 *
 * @public
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

/**
 * A component to render the video stream for a single call participant.
 *
 * Use with {@link GridLayout} in a {@link VideoGallery}.
 *
 * @public
 */
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

  const observer = useRef(
    new ResizeObserver((entries): void => {
      const { width, height } = entries[0].contentRect;
      const minSize = Math.min(width, height, personaMaxSize);
      setPersonaSize(minSize / 2);
    })
  );

  useLayoutEffect(() => {
    if (videoTileRef.current) {
      observer.current.observe(videoTileRef.current);
    }
    const currentObserver = observer.current;
    return () => currentObserver.disconnect();
  }, [observer, videoTileRef]);

  const placeholderOptions = {
    userId,
    text: displayName,
    noVideoAvailableAriaLabel,
    coinSize: personaSize,
    styles: defaultPersonaStyles,
    hidePersonaDetails: true
  };

  const videoHintWithBorderRadius = mergeStyles(videoHint, { borderRadius: theme.effects.roundedCorner4 });

  const tileInfoContainerStyle = useMemo(
    () =>
      mergeStyles(
        isVideoRendered ? videoHintWithBorderRadius : disabledVideoHint,
        getVideoTileOverrideColor(isVideoRendered, theme, 'neutralPrimary'),
        styles?.displayNameContainer
      ),
    [isVideoRendered, videoHintWithBorderRadius, theme, styles?.displayNameContainer]
  );

  const ids = useIdentifiers();

  const isSpeakingStyles = {
    border: `0.25rem solid ${isSpeaking ? theme.palette.themePrimary : 'transparent'}`
  };

  return (
    <Ref innerRef={videoTileRef}>
      <Stack
        data-ui-id={ids.videoTile}
        className={mergeStyles(
          rootStyles,
          isSpeakingStyles,
          { background: theme.palette.neutralLighter, borderRadius: theme.effects.roundedCorner4 },
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

        {(displayName || (showMuteIndicator && isMuted !== undefined)) && (
          <Stack horizontal className={tileInfoContainerStyle}>
            {displayName && (
              <Stack.Item className={mergeStyles(tileInfoStackItemStyle)}>
                <Text className={mergeStyles(displayNameStyle)}>{displayName}</Text>
              </Stack.Item>
            )}
            {showMuteIndicator && isMuted && (
              <Stack.Item className={mergeStyles(iconContainerStyle, tileInfoStackItemStyle)}>
                <Icon iconName="VideoTileMicOff" />
              </Stack.Item>
            )}
          </Stack>
        )}

        {children && (
          <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>{children}</Stack>
        )}
      </Stack>
    </Ref>
  );
};

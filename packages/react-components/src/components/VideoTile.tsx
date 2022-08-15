// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, IStyle, mergeStyles, Persona, Stack, Text } from '@fluentui/react';
import { Ref } from '@fluentui/react-northstar';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useIdentifiers } from '../identifiers';
/* @conditional-compile-remove(one-to-n-calling) */
// @conditional-compile-remove(PSTN-calls)
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { BaseCustomStyles, CustomAvatarOptions, OnRenderAvatarCallback, ParticipantState } from '../types';
import {
  disabledVideoHint,
  displayNameStyle,
  iconContainerStyle,
  isSpeakingBorderDiv,
  overlayContainerStyles,
  rootStyles,
  videoContainerStyles,
  videoHint,
  tileInfoContainerStyle,
  participantStateStyle
} from './styles/VideoTile.styles';
import { getVideoTileOverrideColor } from './utils/videoTileStylesUtils';

/**
 * Strings of {@link VideoTile} that can be overridden.
 * @beta
 */
export interface VideoTileStrings {
  participantStateConnecting: string;
  participantStateRinging: string;
  participantStateHold: string;
}

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
   * Show label on the VideoTile
   * @defaultValue true
   */
  showLabel?: boolean;
  /**
   * Whether to display a mute icon beside the user's display name.
   * @defaultValue true
   */
  showMuteIndicator?: boolean;
  /**
   * Whether the video is muted or not.
   */
  isMuted?: boolean;
  /**
   * Display Name of the Participant to be shown in the label.
   * @remarks `displayName` is used to generate avatar initials if `initialsName` is not provided.
   */
  displayName?: string;
  /**
   * Name of the participant used to generate initials. For example, a name `John Doe` will display `JD` as initials.
   * @remarks `displayName` is used if this property is not specified.
   */
  initialsName?: string;
  /**
   * Minimum size of the persona avatar in px.
   * The persona avatar is the default placeholder shown when no video stream is available.
   * For more information see https://developer.microsoft.com/en-us/fluentui#/controls/web/persona
   * @defaultValue 32px
   */
  personaMinSize?: number;
  /**
   * Maximum size of the personal avatar in px.
   * The persona avatar is the default placeholder shown when no video stream is available.
   * For more information see https://developer.microsoft.com/en-us/fluentui#/controls/web/persona
   * @defaultValue 100px
   */
  personaMaxSize?: number;
  /** Optional property to set the aria label of the video tile if there is no available stream. */
  noVideoAvailableAriaLabel?: string;
  /** Whether the participant in the videoTile is speaking. Shows a speaking indicator (border). */
  isSpeaking?: boolean;

  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * The call connection state of the participant.
   * For example, `Hold` means the participant is on hold.
   */
  participantState?: ParticipantState;
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  strings?: VideoTileStrings;
}

// Coin max size is set to PersonaSize.size100
const DEFAULT_PERSONA_MAX_SIZE_PX = 100;
// Coin min size is set PersonaSize.size32
const DEFAULT_PERSONA_MIN_SIZE_PX = 32;

type DefaultPlaceholderProps = CustomAvatarOptions & {
  participantState?: ParticipantState;
  strings?: Pick<VideoTileStrings, 'participantStateConnecting' | 'participantStateHold' | 'participantStateRinging'>;
};

const DefaultPlaceholder = (props: DefaultPlaceholderProps): JSX.Element => {
  const { text, noVideoAvailableAriaLabel, coinSize, hidePersonaDetails, participantState, strings } = props;

  const participantStateString = React.useMemo(() => {
    if (!strings) {
      return;
    }
    if (participantState === 'Idle' || participantState === 'Connecting') {
      return strings?.participantStateConnecting;
    } else if (participantState === 'EarlyMedia' || participantState === 'Ringing') {
      return strings?.participantStateRinging;
    } else if (participantState === 'Hold') {
      return strings?.participantStateHold;
    }
    return;
  }, [participantState, strings]);

  return (
    <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
      <Stack styles={defaultPersonaStyles}>
        <Persona
          coinSize={coinSize}
          hidePersonaDetails={hidePersonaDetails}
          text={text ?? ''}
          initialsTextColor="white"
          aria-label={noVideoAvailableAriaLabel ?? ''}
          showOverflowTooltip={false}
        />
        {participantStateString && <Text className={mergeStyles(participantStateStyle)}>{participantStateString}</Text>}
      </Stack>
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
    initialsName,
    isMirrored,
    isMuted,
    onRenderPlaceholder,
    renderElement,
    showLabel = true,
    showMuteIndicator = true,
    styles,
    userId,
    noVideoAvailableAriaLabel,
    isSpeaking,
    personaMinSize = DEFAULT_PERSONA_MIN_SIZE_PX,
    personaMaxSize = DEFAULT_PERSONA_MAX_SIZE_PX,
    /* @conditional-compile-remove(one-to-n-calling) */
    /* @conditional-compile-remove(PSTN-calls) */
    participantState
  } = props;

  /* @conditional-compile-remove(one-to-n-calling) */
  // @conditional-compile-remove(PSTN-calls)
  const strings = { ...useLocale().strings.videoTile, ...props.strings };

  const [personaSize, setPersonaSize] = useState(100);
  const videoTileRef = useRef<HTMLElement>(null);

  const theme = useTheme();

  const isVideoRendered = !!renderElement;

  const observer = useRef(
    new ResizeObserver((entries): void => {
      const { width, height } = entries[0].contentRect;
      const personaSize = Math.min(width, height) / 3;
      setPersonaSize(Math.max(Math.min(personaSize, personaMaxSize), personaMinSize));
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
    text: initialsName || displayName,
    noVideoAvailableAriaLabel,
    coinSize: personaSize,
    styles: defaultPersonaStyles,
    hidePersonaDetails: true,
    /* @conditional-compile-remove(one-to-n-calling) */
    /* @conditional-compile-remove(PSTN-calls) */
    participantState: participantState
  };

  const videoHintWithBorderRadius = mergeStyles(videoHint, { borderRadius: theme.effects.roundedCorner4 });

  const tileInfoStyle = useMemo(
    () =>
      mergeStyles(
        isVideoRendered ? videoHintWithBorderRadius : disabledVideoHint,
        getVideoTileOverrideColor(isVideoRendered, theme, 'neutralPrimary'),
        styles?.displayNameContainer
      ),
    [isVideoRendered, videoHintWithBorderRadius, theme, styles?.displayNameContainer]
  );

  const ids = useIdentifiers();

  return (
    <Ref innerRef={videoTileRef}>
      <Stack
        data-ui-id={ids.videoTile}
        className={mergeStyles(
          rootStyles,
          {
            background: theme.palette.neutralLighter,
            borderRadius: theme.effects.roundedCorner4
          },
          styles?.root
        )}
      >
        <div
          className={mergeStyles(isSpeakingBorderDiv, {
            borderRadius: theme.effects.roundedCorner4,
            border: `0.25rem solid ${isSpeaking ? theme.palette.themePrimary : 'transparent'}`
          })}
        />

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
              <DefaultPlaceholder
                {...placeholderOptions}
                /* @conditional-compile-remove(one-to-n-calling) */
                // @conditional-compile-remove(PSTN-calls)
                strings={strings}
              />
            )}
          </Stack>
        )}

        {showLabel && (displayName || (showMuteIndicator && isMuted)) && (
          <Stack horizontal className={tileInfoContainerStyle}>
            <Stack horizontal className={tileInfoStyle}>
              {displayName && (
                <Text className={mergeStyles(displayNameStyle)} title={displayName}>
                  {displayName}
                </Text>
              )}
              {showMuteIndicator && isMuted && (
                <Stack className={mergeStyles(iconContainerStyle)}>
                  <Icon iconName="VideoTileMicOff" />
                </Stack>
              )}
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

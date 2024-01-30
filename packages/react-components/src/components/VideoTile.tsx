// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, IStyle, mergeStyles, Persona, Stack, Text } from '@fluentui/react';
/* @conditional-compile-remove(pinned-participants) */
import { IconButton } from '@fluentui/react';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
/* @conditional-compile-remove(reaction) */
import { useCallback, useEffect } from 'react';
import { useIdentifiers } from '../identifiers';
import { ComponentLocale, useLocale } from '../localization';
import { useTheme } from '../theming';
import { BaseCustomStyles, CustomAvatarOptions, OnRenderAvatarCallback } from '../types';
/* @conditional-compile-remove(raise-hand) */
import { CallingTheme } from '../theming';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHand } from '../types';
/* @conditional-compile-remove(reaction) */
import { Reaction } from '../types';
/* @conditional-compile-remove(raise-hand) */
import { RaisedHandIcon } from './assets/RaisedHandIcon';
/* @conditional-compile-remove(one-to-n-calling) */
/* @conditional-compile-remove(PSTN-calls) */
import { ParticipantState } from '../types';
import {
  disabledVideoHint,
  displayNameStyle,
  iconContainerStyle,
  overlayContainerStyles,
  rootStyles,
  videoContainerStyles,
  videoHint,
  tileInfoContainerStyle,
  participantStateStringStyles
} from './styles/VideoTile.styles';
/* @conditional-compile-remove(reaction) */
import { reactionRenderingStyle } from './styles/VideoTile.styles';
import { getVideoTileOverrideColor } from './utils/videoTileStylesUtils';
/* @conditional-compile-remove(pinned-participants) */
import { pinIconStyle } from './styles/VideoTile.styles';
/* @conditional-compile-remove(pinned-participants) */
import { DirectionalHint, IContextualMenuProps } from '@fluentui/react';
/* @conditional-compile-remove(pinned-participants) */
import useLongPress from './utils/useLongPress';
/* @conditional-compile-remove(pinned-participants) */
import { moreButtonStyles } from './styles/VideoTile.styles';
/* @conditional-compile-remove(raise-hand) */
import { raiseHandContainerStyles } from './styles/VideoTile.styles';
/* @conditional-compile-remove(reaction) */
import { ReactionResources } from '../types/ReactionTypes';
/* @conditional-compile-remove(reaction) */
import { getEmojiResource } from './VideoGallery/utils/videoGalleryLayoutUtils';

/**
 * Strings of {@link VideoTile} that can be overridden.
 * @beta
 */
export interface VideoTileStrings {
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
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * If true, the video tile will show the pin icon.
   */
  isPinned?: boolean;
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

  /* @conditional-compile-remove(raise-hand) */
  /** Whether the participant is raised hand. Show a indicator (border) and icon with order */
  raisedHand?: RaisedHand;

  /* @conditional-compile-remove(reaction) */
  /** When the participant has reacted, animate the reaction. */
  reaction?: Reaction;

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
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * Display custom menu items in the VideoTile's contextual menu.
   * Uses Fluent UI ContextualMenu.
   * An ellipses icon will be displayed to open the contextual menu if this prop is defined.
   */
  contextualMenu?: IContextualMenuProps;
  /* @conditional-compile-remove(pinned-participants) */
  /**
   * Callback triggered by video tile on touch and hold.
   */
  onLongTouch?: () => void;
  /* @conditional-compile-remove(spotlight) */
  /**
   * If true, the video tile will show the spotlighted icon.
   */
  isSpotlighted?: boolean;
  /* @conditional-compile-remove(reaction) */
  /**
   * Reactions resources' url and metadata.
   */
  reactionResources?: ReactionResources;
}

// Coin max size is set to PersonaSize.size100
const DEFAULT_PERSONA_MAX_SIZE_PX = 100;
// Coin min size is set PersonaSize.size32
const DEFAULT_PERSONA_MIN_SIZE_PX = 32;

const DefaultPlaceholder = (props: CustomAvatarOptions): JSX.Element => {
  const { text, noVideoAvailableAriaLabel, coinSize, hidePersonaDetails } = props;

  return (
    <Stack className={mergeStyles({ position: 'absolute', height: '100%', width: '100%' })}>
      <Stack styles={defaultPersonaStyles}>
        {coinSize && (
          <Persona
            coinSize={coinSize}
            hidePersonaDetails={hidePersonaDetails}
            text={text ?? ''}
            initialsTextColor="white"
            aria-label={noVideoAvailableAriaLabel ?? ''}
            showOverflowTooltip={false}
          />
        )}
      </Stack>
    </Stack>
  );
};

const defaultPersonaStyles = { root: { margin: 'auto', maxHeight: '100%' } };

/* @conditional-compile-remove(pinned-participants) */
const videoTileMoreMenuIconProps = { iconName: undefined, style: { display: 'none' } };
/* @conditional-compile-remove(pinned-participants) */
const videoTileMoreMenuProps = {
  directionalHint: DirectionalHint.topLeftEdge,
  isBeakVisible: false,
  styles: { container: { maxWidth: '8rem' } }
};
/* @conditional-compile-remove(pinned-participants) */
const VideoTileMoreOptionsButton = (props: {
  contextualMenu?: IContextualMenuProps;
  canShowContextMenuButton: boolean;
}): JSX.Element => {
  const { contextualMenu, canShowContextMenuButton } = props;
  if (!contextualMenu) {
    return <></>;
  }

  const optionsIcon = canShowContextMenuButton ? 'VideoTileMoreOptions' : undefined;

  return (
    <IconButton
      data-ui-id="video-tile-more-options-button"
      styles={moreButtonStyles}
      menuIconProps={videoTileMoreMenuIconProps}
      menuProps={{ ...videoTileMoreMenuProps, ...contextualMenu }}
      iconProps={{ iconName: optionsIcon }}
    />
  );
};

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
    /* @conditional-compile-remove(spotlight) */
    isSpotlighted,
    /* @conditional-compile-remove(pinned-participants) */
    isPinned,
    onRenderPlaceholder,
    renderElement,
    showLabel = true,
    showMuteIndicator = true,
    styles,
    userId,
    noVideoAvailableAriaLabel,
    isSpeaking,
    /* @conditional-compile-remove(raise-hand) */
    raisedHand,
    /* @conditional-compile-remove(reaction) */
    reaction,
    personaMinSize = DEFAULT_PERSONA_MIN_SIZE_PX,
    personaMaxSize = DEFAULT_PERSONA_MAX_SIZE_PX,
    /* @conditional-compile-remove(pinned-participants) */
    contextualMenu,
    /* @conditional-compile-remove(reaction) */
    reactionResources
  } = props;

  /* @conditional-compile-remove(pinned-participants) */
  const [isHovered, setIsHovered] = useState<boolean>(false);
  /* @conditional-compile-remove(pinned-participants) */
  const [isFocused, setIsFocused] = useState<boolean>(false);
  // need to set a default otherwise the resizeObserver will get stuck in an infinite loop.
  const [personaSize, setPersonaSize] = useState<number>(1);
  /* @conditional-compile-remove(reaction) */
  const [isValidImageSource, setIsValidImageSource] = useState<boolean>(false);
  const videoTileRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const theme = useTheme();

  const isVideoRendered = !!renderElement;

  const observer = useRef(
    new ResizeObserver((entries): void => {
      const { width, height } = entries[0].contentRect;
      const personaCalcSize = Math.min(width, height) / 3;
      // we only want to set the persona size if it has changed
      if (personaCalcSize !== personaSize) {
        setPersonaSize(Math.max(Math.min(personaCalcSize, personaMaxSize), personaMinSize));
      }
    })
  );

  useLayoutEffect(() => {
    if (videoTileRef.current) {
      observer.current.observe(videoTileRef.current);
    }
    const currentObserver = observer.current;
    return () => currentObserver.disconnect();
  }, [videoTileRef]);

  /* @conditional-compile-remove(pinned-participants) */
  const useLongPressProps = useMemo(() => {
    return {
      onLongPress: () => {
        props.onLongTouch?.();
      },
      touchEventsOnly: true
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onLongTouch]);
  /* @conditional-compile-remove(pinned-participants) */
  const longPressHandlers = useLongPress(useLongPressProps);
  const longPressHandlersTrampoline = useMemo(() => {
    /* @conditional-compile-remove(pinned-participants) */
    return longPressHandlers;
    return {};
  }, [
    /* @conditional-compile-remove(pinned-participants) */
    longPressHandlers
  ]);

  const hoverHandlers = useMemo(() => {
    /* @conditional-compile-remove(pinned-participants) */
    return {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false)
    };
    return {};
  }, []);

  const placeholderOptions = {
    userId,
    text: initialsName ?? displayName,
    noVideoAvailableAriaLabel,
    coinSize: personaSize,
    styles: defaultPersonaStyles,
    hidePersonaDetails: true
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

  const canShowLabel = showLabel && (displayName || (showMuteIndicator && isMuted));
  const participantStateString = participantStateStringTrampoline(props, locale);
  /* @conditional-compile-remove(pinned-participants) */
  const canShowContextMenuButton = isHovered || isFocused;
  let raisedHandBackgroundColor = '';
  /* @conditional-compile-remove(raise-hand) */
  const callingPalette = (theme as unknown as CallingTheme).callingPalette;
  /* @conditional-compile-remove(raise-hand) */
  raisedHandBackgroundColor = callingPalette.raiseHandGold;

  /* @conditional-compile-remove(reaction) */
  const backgroundImageUrl =
    reaction !== undefined && reactionResources !== undefined
      ? getEmojiResource(reaction?.reactionType, reactionResources)
      : '';
  /* @conditional-compile-remove(reaction) */
  const currentTimestamp = new Date();
  /* @conditional-compile-remove(reaction) */
  const currentUnixTimeStamp = Math.floor(currentTimestamp.getTime() / 1000);
  /* @conditional-compile-remove(reaction) */
  const receivedUnixTimestamp = reaction ? Math.floor(reaction.receivedAt.getTime() / 1000) : undefined;
  /* @conditional-compile-remove(reaction) */
  const canRenderReaction =
    (receivedUnixTimestamp ? currentUnixTimeStamp - receivedUnixTimestamp < 3000 : false) &&
    backgroundImageUrl !== undefined;
  /* @conditional-compile-remove(reaction) */
  useEffect(() => {
    if (!backgroundImageUrl || backgroundImageUrl.length === 0) {
      return;
    }

    fetch(`${backgroundImageUrl}`)
      .then((res) => setIsValidImageSource(res.ok))
      .catch((warning) => console.warn(`Sprite image for animation rendering failed with warning: ${warning}`));

    return () => setIsValidImageSource(false);
  }, [backgroundImageUrl]);
  /* @conditional-compile-remove(reaction) */
  const spriteImageUrl = backgroundImageUrl !== undefined ? backgroundImageUrl : '';
  /* @conditional-compile-remove(reaction) */
  const reactionContainerStyles = useCallback(
    () =>
      reactionRenderingStyle({
        spriteImageUrl,
        personaSize
      }),
    [spriteImageUrl, personaSize]
  );

  return (
    <Stack
      data-ui-id={ids.videoTile}
      className={mergeStyles(
        rootStyles,
        {
          background: theme.palette.neutralLighter,
          borderRadius: theme.effects.roundedCorner4
        },
        (isSpeaking || /* @conditional-compile-remove(raise-hand) */ raisedHand) && {
          '&::after': {
            content: `''`,
            position: 'absolute',
            border: `0.25rem solid ${isSpeaking ? theme.palette.themePrimary : raisedHandBackgroundColor}`,
            borderRadius: theme.effects.roundedCorner4,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }
        },
        styles?.root
      )}
      {...longPressHandlersTrampoline}
    >
      <div ref={videoTileRef} style={{ width: '100%', height: '100%' }} {...hoverHandlers} data-is-focusable={true}>
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
          <Stack
            className={mergeStyles(videoContainerStyles, {
              opacity:
                participantStateString ||
                /* @conditional-compile-remove(PSTN-calls) */ props.participantState === 'Idle'
                  ? 0.4
                  : 1
            })}
          >
            {onRenderPlaceholder ? (
              onRenderPlaceholder(userId ?? '', placeholderOptions, DefaultPlaceholder)
            ) : (
              <DefaultPlaceholder {...placeholderOptions} />
            )}
          </Stack>
        )}

        {
          /* @conditional-compile-remove(reaction) */
          canRenderReaction && isValidImageSource && (
            <Stack
              className={mergeStyles(videoContainerStyles, {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: reaction ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
              })}
            >
              <div style={{ height: '33.33%' }}></div>
              <div style={{ height: '84px', width: '84px' }}>
                <div className={reactionContainerStyles()} />
              </div>
            </Stack>
          )
        }
        {(canShowLabel || participantStateString) && (
          <Stack horizontal className={tileInfoContainerStyle} tokens={tileInfoContainerTokens}>
            <Stack horizontal className={tileInfoStyle}>
              {canShowLabel && (
                <Text
                  className={mergeStyles(displayNameStyle)}
                  title={displayName}
                  style={{ color: participantStateString ? theme.palette.neutralSecondary : 'inherit' }}
                  data-ui-id="video-tile-display-name"
                >
                  {displayName}
                </Text>
              )}
              {participantStateString && (
                <Text className={mergeStyles(participantStateStringStyles(theme))}>
                  {bracketedParticipantString(participantStateString, !!canShowLabel)}
                </Text>
              )}
              {showMuteIndicator && isMuted && (
                <Stack className={mergeStyles(iconContainerStyle)}>
                  <Icon iconName="VideoTileMicOff" />
                </Stack>
              )}
              {
                /* @conditional-compile-remove(spotlight) */
                isSpotlighted && (
                  <Stack className={mergeStyles(iconContainerStyle)}>
                    <Icon iconName="VideoSpotlighted" />
                  </Stack>
                )
              }
              {
                /* @conditional-compile-remove(pinned-participants) */
                isPinned && (
                  <Stack className={mergeStyles(iconContainerStyle)}>
                    <Icon iconName="VideoTilePinned" className={mergeStyles(pinIconStyle)} />
                  </Stack>
                )
              }
              {
                /* @conditional-compile-remove(pinned-participants) */
                <VideoTileMoreOptionsButton
                  contextualMenu={contextualMenu}
                  canShowContextMenuButton={canShowContextMenuButton}
                />
              }
            </Stack>
          </Stack>
        )}

        {children && (
          <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>{children}</Stack>
        )}
        {
          /* @conditional-compile-remove(raise-hand) */ raisedHand && (
            <Stack
              horizontal={true}
              tokens={{ childrenGap: '0.2rem' }}
              className={raiseHandContainerStyles(theme, !canShowLabel)}
            >
              <Stack.Item>
                <Text>{raisedHand.raisedHandOrderPosition}</Text>
              </Stack.Item>
              <Stack.Item>
                <RaisedHandIcon />
              </Stack.Item>
            </Stack>
          )
        }
      </div>
    </Stack>
  );
};

const participantStateStringTrampoline = (props: VideoTileProps, locale: ComponentLocale): string | undefined => {
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  const strings = { ...locale.strings.videoTile, ...props.strings };
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  return props.participantState === 'EarlyMedia' || props.participantState === 'Ringing'
    ? strings?.participantStateRinging
    : props.participantState === 'Hold'
    ? strings?.participantStateHold
    : undefined;

  return undefined;
};

const tileInfoContainerTokens = {
  // A horizontal Stack sets the left margin to 0 for all it's children.
  // We need to allow the children to set their own margins
  childrenGap: 'none'
};

const bracketedParticipantString = (participantString: string, withBrackets: boolean): string => {
  return withBrackets ? `(${participantString})` : participantString;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  DirectionalHint,
  Icon,
  IconButton,
  IContextualMenuProps,
  IStyle,
  mergeStyles,
  Persona,
  Stack,
  Text
} from '@fluentui/react';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useIdentifiers } from '../identifiers';
import { ComponentLocale, useLocale } from '../localization';
import { useTheme } from '../theming';
import { BaseCustomStyles, CustomAvatarOptions, OnRenderAvatarCallback } from '../types';
import { CallingTheme } from '../theming';
import { RaisedHand } from '../types';
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
  tileInfoContainerStyle,
  participantStateStringStyles
} from './styles/VideoTile.styles';
import { pinIconStyle } from './styles/VideoTile.styles';
import useLongPress from './utils/useLongPress';
import { moreButtonStyles } from './styles/VideoTile.styles';
import { raiseHandContainerStyles } from './styles/VideoTile.styles';
import { ReactionResources } from '../types/ReactionTypes';

/**
 * Strings of {@link VideoTile} that can be overridden.
 * @public
 */
export interface VideoTileStrings {
  /** Aria label for announcing the remote video tile drawer menu */
  moreOptionsButtonAriaLabel: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  participantStateRinging: string;
  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
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
  /**
   * Overlay component responsible for rendering reaction
   */
  overlay?: JSX.Element | null;
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
   * Show label background on the VideoTile
   * @defaultValue false
   */
  alwaysShowLabelBackground?: boolean;
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

  /** Whether the participant is raised hand. Show a indicator (border) and icon with order */
  raisedHand?: RaisedHand;

  /* @conditional-compile-remove(one-to-n-calling) */
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * The call connection state of the participant.
   * For example, `Hold` means the participant is on hold.
   */
  participantState?: ParticipantState;
  /**
   * Strings to override in the component.
   */
  strings?: VideoTileStrings;
  /**
   * Display custom menu items in the VideoTile's contextual menu.
   * Uses Fluent UI ContextualMenu.
   * An ellipses icon will be displayed to open the contextual menu if this prop is defined.
   */
  contextualMenu?: IContextualMenuProps;
  /**
   * Callback triggered by video tile on touch and hold.
   */
  onLongTouch?: () => void;
  /**
   * If true, the video tile will show the spotlighted icon.
   */
  isSpotlighted?: boolean;
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

const videoTileMoreMenuIconProps = { iconName: undefined, style: { display: 'none' } };
const videoTileMoreMenuProps = {
  directionalHint: DirectionalHint.topLeftEdge,
  isBeakVisible: false,
  styles: { container: { maxWidth: '8rem' } }
};
const VideoTileMoreOptionsButton = (props: {
  contextualMenu?: IContextualMenuProps;
  canShowContextMenuButton: boolean;
}): JSX.Element => {
  const locale = useLocale();
  const theme = useTheme();
  const strings = { ...locale.strings.videoTile };

  const { contextualMenu, canShowContextMenuButton } = props;
  if (!contextualMenu) {
    return <></>;
  }

  const optionsIcon = canShowContextMenuButton ? 'VideoTileMoreOptions' : undefined;

  return (
    <IconButton
      data-ui-id="video-tile-more-options-button"
      ariaLabel={strings?.moreOptionsButtonAriaLabel}
      styles={moreButtonStyles(theme)}
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
    isSpotlighted,
    isPinned,
    onRenderPlaceholder,
    renderElement,
    overlay: reactionOverlay,
    showLabel = true,
    showMuteIndicator = true,
    styles,
    userId,
    noVideoAvailableAriaLabel,
    isSpeaking,
    raisedHand,
    personaMinSize = DEFAULT_PERSONA_MIN_SIZE_PX,
    personaMaxSize = DEFAULT_PERSONA_MAX_SIZE_PX,
    contextualMenu
  } = props;

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  // need to set a default otherwise the resizeObserver will get stuck in an infinite loop.
  const [personaSize, setPersonaSize] = useState<number>(1);

  const videoTileRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const theme = useTheme();
  const callingPalette = (theme as unknown as CallingTheme).callingPalette;

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

  // TODO: Remove after calling sdk fix the keybaord focus
  useEffect(() => {
    // PPTLive stream id is null
    if (videoTileRef.current?.id) {
      return;
    }
    let observer: MutationObserver | undefined;
    if (videoTileRef.current) {
      observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList') {
            const iframe = document.querySelector('iframe');
            if (iframe) {
              if (!iframe.getAttribute('tabIndex')) {
                iframe.setAttribute('tabIndex', '-1');
              }
            }
          }
        }
      });

      observer.observe(videoTileRef.current, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
    };
  }, [displayName, renderElement]);

  const useLongPressProps = useMemo(() => {
    return {
      onLongPress: () => {
        props.onLongTouch?.();
      },
      touchEventsOnly: true
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onLongTouch]);
  const longPressHandlers = useLongPress(useLongPressProps);

  const hoverHandlers = useMemo(() => {
    return {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false)
    };
  }, []);

  const placeholderOptions = {
    userId,
    text: initialsName ?? displayName,
    noVideoAvailableAriaLabel,
    coinSize: personaSize,
    styles: defaultPersonaStyles,
    hidePersonaDetails: true
  };

  const videoHintWithBorderRadius = mergeStyles(disabledVideoHint, {
    borderRadius: theme.effects.roundedCorner4,
    backgroundColor: callingPalette.videoTileLabelBackgroundLight
  });

  const tileInfoStyle = useMemo(
    () =>
      mergeStyles(
        isVideoRendered || props.alwaysShowLabelBackground ? videoHintWithBorderRadius : disabledVideoHint,
        styles?.displayNameContainer
      ),
    [isVideoRendered, videoHintWithBorderRadius, styles?.displayNameContainer, props.alwaysShowLabelBackground]
  );

  const ids = useIdentifiers();

  const canShowLabel = showLabel && (displayName || (showMuteIndicator && isMuted));
  const participantStateString = participantStateStringTrampoline(props, locale);
  const canShowContextMenuButton = isHovered || isFocused;
  let raisedHandBackgroundColor = '';
  raisedHandBackgroundColor = callingPalette.raiseHandGold;

  return (
    <Stack
      data-ui-id={ids.videoTile}
      className={mergeStyles(
        rootStyles,
        {
          background: theme.palette.neutralLighter,
          borderRadius: theme.effects.roundedCorner4
        },
        (isSpeaking || raisedHand) && {
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
      {...longPressHandlers}
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
        {reactionOverlay}
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
              {isSpotlighted && (
                <Stack className={mergeStyles(iconContainerStyle)}>
                  <Icon iconName="VideoTileSpotlighted" />
                </Stack>
              )}
              {isPinned && (
                <Stack className={mergeStyles(iconContainerStyle)}>
                  <Icon iconName="VideoTilePinned" className={mergeStyles(pinIconStyle)} />
                </Stack>
              )}
              <VideoTileMoreOptionsButton
                contextualMenu={contextualMenu}
                canShowContextMenuButton={canShowContextMenuButton}
              />
            </Stack>
          </Stack>
        )}

        {children && (
          <Stack className={mergeStyles(overlayContainerStyles, styles?.overlayContainer)}>{children}</Stack>
        )}
        {raisedHand && (
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
        )}
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

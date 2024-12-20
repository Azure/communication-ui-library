// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useCallback, useEffect, useState } from 'react';
/* @conditional-compile-remove(together-mode) */
import {
  Reaction,
  ReactionResources,
  VideoGalleryTogetherModeParticipantPosition,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant
} from '../types';
/* @conditional-compile-remove(together-mode) */
import { moveAnimationStyles, spriteAnimationStyles } from './styles/ReactionOverlay.style';
/* @conditional-compile-remove(together-mode) */
import {
  // getCombinedKey,
  REACTION_NUMBER_OF_ANIMATION_FRAMES
  // REACTION_START_DISPLAY_SIZE
} from './VideoGallery/utils/reactionUtils';
/* @conditional-compile-remove(together-mode) */
import { Icon, Text } from '@fluentui/react';
/* @conditional-compile-remove(together-mode) */
import { getEmojiResource } from './VideoGallery/utils/videoGalleryLayoutUtils';
/* @conditional-compile-remove(together-mode) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(together-mode) */
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
/* @conditional-compile-remove(together-mode) */
import {
  calculateScaledSize,
  getTogetherModeParticipantOverlayStyle,
  getTogetherModeSeatPositionStyle,
  ITogetherModeSeatPositionStyle
} from './styles/TogetherMode.styles';
import { CallingTheme, useTheme } from '../theming';
// import { iconContainerStyle, raiseHandContainerStyles } from './styles/VideoTile.styles';
import { RaisedHandIcon } from './assets/RaisedHandIcon';
/* @conditional-compile-remove(together-mode) */
// import { iconContainerStyle } from './styles/VideoTile.styles';
// import { useTheme } from '../theming';

/* @conditional-compile-remove(together-mode) */
/**
 * Signaling action overlay component props
 *
 * Can be used with {@link VideoTile}.
 *
 * @internal
 */
type VisibleTogetherModeSignalingAction = {
  reaction?: Reaction;
  isHandRaised?: boolean;
  isSpotlighted?: boolean;
  isMuted?: boolean;
  id: string;
  seatPositionStyle: ITogetherModeSeatPositionStyle;
  displayName?: string;
  showDisplayName?: boolean;
};

/* @conditional-compile-remove(together-mode) */
/**
 * TogetherModeOverlay component renders an empty JSX element.
 *
 * @returns {JSX.Element} An empty JSX element.
 */
export const TogetherModeOverlay = React.memo(
  (props: {
    emojiSize: number;
    reactionResources: ReactionResources;
    localParticipant: VideoGalleryLocalParticipant;
    remoteParticipants: VideoGalleryRemoteParticipant[];
    participantsSeatingArrangement: VideoGalleryTogetherModeParticipantPosition;
  }) => {
    const locale = useLocale();
    const theme = useTheme();
    const callingPalette = (theme as unknown as CallingTheme).callingPalette;

    const { emojiSize, reactionResources, remoteParticipants, localParticipant, participantsSeatingArrangement } =
      props;
    const [visibleSignals, setVisibleSignals] = useState<{ [key: string]: VisibleTogetherModeSignalingAction }>({});
    const [hoveredParticipantID, setHoveredParticipantID] = useState('');

    // When a 50-participant scene switches to a smaller group in Together Mode, signals for those no longer in the stream are removed
    const hideSignalForParticipantsNotInTogetherMode = useCallback(() => {
      const removedVisibleParticipants = Object.keys(visibleSignals).filter(
        (participantId) => !participantsSeatingArrangement[participantId]
      );
      setVisibleSignals((prevSignals) => {
        const newSignals = { ...prevSignals };
        removedVisibleParticipants.forEach((participantId) => {
          delete newSignals[participantId];
        });

        // Trigger a re-render only if changes occurred
        const hasChanges = Object.keys(newSignals).length !== Object.keys(prevSignals).length;
        if (hasChanges) {
          return newSignals;
        }
        return prevSignals;
      });
    }, [visibleSignals, participantsSeatingArrangement]);

    const updateTogetherModeSignals = useCallback(() => {
      const allParticipants = [...remoteParticipants, localParticipant];

      const participantsWithVideoAvailable = allParticipants.filter(
        (p) => p.videoStream?.isAvailable && participantsSeatingArrangement[p.userId]
      );
      const updatedSignals = participantsWithVideoAvailable.reduce(
        (acc: { [key: string]: VisibleTogetherModeSignalingAction }, p: VideoGalleryLocalParticipant) => {
          const { userId, reaction, raisedHand, spotlight, isMuted, displayName } = p;
          const seatingPosition = participantsSeatingArrangement[userId];
          if (seatingPosition) {
            acc[userId] = {
              id: userId,
              reaction,
              isHandRaised: !!raisedHand,
              isSpotlighted: !!spotlight,
              isMuted,
              displayName: displayName || locale.strings.videoGallery.displayNamePlaceholder,
              showDisplayName: !!(spotlight || raisedHand || reaction || hoveredParticipantID === userId),
              seatPositionStyle: getTogetherModeSeatPositionStyle(seatingPosition)
            };
          }
          return acc;
        },
        {}
      );

      const participantsNotInTogetherModeStream = Object.keys(visibleSignals).filter((id) => !updatedSignals[id]);

      setVisibleSignals((prevSignals) => {
        const newSignals = { ...prevSignals, ...updatedSignals };
        participantsNotInTogetherModeStream.forEach((id) => {
          delete newSignals[id];
        });

        const hasChanges = Object.keys(newSignals).some(
          (key) => JSON.stringify(newSignals[key]) !== JSON.stringify(prevSignals[key])
        );

        return hasChanges ? newSignals : prevSignals;
      });
    }, [
      remoteParticipants,
      localParticipant,
      visibleSignals,
      participantsSeatingArrangement,
      locale.strings.videoGallery.displayNamePlaceholder,
      hoveredParticipantID
    ]);

    // Trigger updates on dependency changes
    useEffect(() => {
      updateTogetherModeSignals();
      hideSignalForParticipantsNotInTogetherMode();
    }, [
      remoteParticipants,
      localParticipant,
      participantsSeatingArrangement,
      hoveredParticipantID,
      updateTogetherModeSignals,
      hideSignalForParticipantsNotInTogetherMode
    ]);

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'white'
        }}
      >
        {Object.values(visibleSignals).map((participantSignal) => (
          <div
            key={participantSignal.id}
            style={{
              ...getTogetherModeParticipantOverlayStyle(participantSignal.seatPositionStyle),
              position: 'absolute',
              left: `${participantSignal.seatPositionStyle.seatCoordinates.left}px`,
              top: `${participantSignal.seatPositionStyle.seatCoordinates.top}px`,
              border: '1px solid red'
            }}
            onMouseEnter={() => setHoveredParticipantID(participantSignal.id)}
            onMouseLeave={() => setHoveredParticipantID('')}
          >
            <div className="togetherMode-item">
              {participantSignal.reaction?.reactionType && (
                <div
                  style={moveAnimationStyles(
                    (participantSignal.seatPositionStyle.seatCoordinates.height ?? 1) * 0.5,
                    (participantSignal.seatPositionStyle.seatCoordinates.height ?? 1) * 0.35
                  )}
                >
                  <div
                    style={{
                      width: `${emojiSize}px`,
                      position: 'absolute',
                      left: `${(100 - (emojiSize / (participantSignal.seatPositionStyle.seatCoordinates.width ?? 1)) * 100) / 2}%`
                    }}
                  >
                    <div
                      style={spriteAnimationStyles(
                        REACTION_NUMBER_OF_ANIMATION_FRAMES,
                        calculateScaledSize(
                          participantSignal.seatPositionStyle.seatCoordinates.width ?? 1,
                          participantSignal.seatPositionStyle.seatCoordinates.height ?? 1
                        ),
                        (participantSignal.reaction &&
                          getEmojiResource(participantSignal?.reaction.reactionType, reactionResources)) ??
                          ''
                      )}
                    />
                  </div>
                </div>
              )}

              {participantSignal.showDisplayName && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.5%',
                    width: '100%',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: callingPalette.videoTileLabelBackgroundLight,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '2px',
                      margin: '0 auto', // Centers the container
                      // maxWidth: 'max-content', // Allows container to grow with content
                      transition: 'width 0.3s ease, max-width 0.3s ease', // Smooth transition for container expansion
                      padding: '0 5px',
                      borderRadius: theme.effects.roundedCorner4,
                      borderColor: 'white',
                      width: 'fit-content'
                    }}
                  >
                    {participantSignal.isHandRaised && (
                      <span
                        style={{
                          width: '20px',
                          flexShrink: 0
                        }}
                      >
                        <RaisedHandIcon />
                      </span>
                    )}
                    {participantSignal.showDisplayName && (
                      <Text
                        style={{
                          textOverflow: 'ellipsis',
                          flexGrow: 1, // Allow text to grow within available space
                          overflow: hoveredParticipantID === participantSignal.id ? 'visible' : 'hidden',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                          // width: hoveredParticipantID === `${participantSignal.id}` ? 'calc(100% - 100px)' : 'auto', // Expand width from center
                          transition: 'width 0.3s ease', // Smooth transition for width changes
                          color: participantSignal.displayName ? theme.palette.neutralSecondary : 'inherit',
                          display:
                            hoveredParticipantID === participantSignal.id ||
                            (participantSignal.seatPositionStyle.seatCoordinates.width ?? 0) > 100
                              ? 'inline-block'
                              : 'none' // Completely remove the element when hidden
                        }}
                      >
                        {participantSignal.displayName}
                      </Text>
                    )}
                    {participantSignal.isMuted && (
                      <Icon
                        iconName="VideoTileMicOff"
                        // className={mergeStyles(iconContainerStyle)}
                        style={{
                          width: '20px',
                          flexShrink: 0,
                          color: participantSignal.displayName ? theme.palette.neutralSecondary : 'inherit'
                        }}
                      />
                    )}
                    {participantSignal.isSpotlighted && (
                      <Icon
                        iconName="VideoTileSpotlighted"
                        // className={mergeStyles(iconContainerStyle)}
                        style={{
                          width: '20px',
                          flexShrink: 0,
                          color: participantSignal.displayName ? theme.palette.neutralSecondary : 'inherit'
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

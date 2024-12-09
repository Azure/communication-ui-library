// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  REACTION_NUMBER_OF_ANIMATION_FRAMES,
  REACTION_START_DISPLAY_SIZE
} from './VideoGallery/utils/reactionUtils';
/* @conditional-compile-remove(together-mode) */
import { Icon, mergeStyles, Stack, Text } from '@fluentui/react';
/* @conditional-compile-remove(together-mode) */
import { getEmojiResource } from './VideoGallery/utils/videoGalleryLayoutUtils';
/* @conditional-compile-remove(together-mode) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(together-mode) */
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
/* @conditional-compile-remove(together-mode) */
import {
  ellipsisTextStyle,
  getTogetherModeParticipantOverlayStyle,
  getTogetherModeSeatPositionStyle,
  ITogetherModeSeatPositionStyle
} from './styles/TogetherMode.styles';
/* @conditional-compile-remove(together-mode) */
import { iconContainerStyle } from './styles/VideoTile.styles';

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
  id?: string;
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
    emojiSize?: number;
    reactionResources: ReactionResources;
    localParticipant?: VideoGalleryLocalParticipant;
    remoteParticipants?: VideoGalleryRemoteParticipant[];
    participantsSeatingArrangement?: VideoGalleryTogetherModeParticipantPosition;
  }) => {
    const locale = useLocale();
    const { reactionResources, remoteParticipants, localParticipant, participantsSeatingArrangement } = props;
    const [visibleSignals, setVisibleSignals] = useState<Record<string, VisibleTogetherModeSignalingAction>>({});
    const [hoveredParticipantID, setHoveredParticipantID] = useState('');

    useMemo(() => {
      const updatedParticipantsIds = remoteParticipants?.map((participant) => participant.userId) ?? [];
      updatedParticipantsIds.push(localParticipant?.userId ?? '');

      const removedVisibleParticipants = Object.keys(visibleSignals).filter(
        (participantId) => !updatedParticipantsIds.includes(participantId)
      );

      removedVisibleParticipants.forEach((participantId) => {
        delete visibleSignals[participantId];
      });
    }, [remoteParticipants, localParticipant, visibleSignals]);

    const updateTogetherModeSeatingUI = useCallback(
      (participant: VideoGalleryLocalParticipant | VideoGalleryRemoteParticipant): void => {
        const participantID = participant.userId;
        const seatingPosition = participantsSeatingArrangement?.[participantID];
        if (!seatingPosition) {
          return;
        }
        const togetherModeSeatStyle: ITogetherModeSeatPositionStyle = getTogetherModeSeatPositionStyle(seatingPosition);

        setVisibleSignals((prevVisibleSignals) => ({
          ...prevVisibleSignals,
          [participantID]: {
            id: participantID,
            reaction: participant.reaction,
            isHandRaised: !!participant.raisedHand,
            isSpotlighted: !!participant.spotlight,
            isMuted: participant.isMuted,
            displayName: participant.displayName || locale.strings.videoGallery.displayNamePlaceholder,
            showDisplayName: !!(
              participant.spotlight ||
              participant.raisedHand ||
              participant.reaction ||
              hoveredParticipantID === participantID
            ),
            seatPositionStyle: togetherModeSeatStyle
          }
        }));
      },
      [hoveredParticipantID, locale.strings.videoGallery.displayNamePlaceholder, participantsSeatingArrangement]
    );

    useEffect(() => {
      remoteParticipants?.forEach((participant) => {
        if (participant.videoStream?.isAvailable) {
          updateTogetherModeSeatingUI(participant);
        }
      });

      if (localParticipant) {
        if (localParticipant.videoStream?.isAvailable) {
          updateTogetherModeSeatingUI(localParticipant);
        }
      }
    }, [remoteParticipants, localParticipant, participantsSeatingArrangement, updateTogetherModeSeatingUI]);

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0'
        }}
      >
        {Object.values(visibleSignals).map((participantSignal) => (
          <div
            key={participantSignal.id}
            style={{
              ...getTogetherModeParticipantOverlayStyle(participantSignal.seatPositionStyle),
              border: '1px solid red',
              position: 'absolute',
              left: `${participantSignal.seatPositionStyle.seatCoordinates.left}px`,
              top: `${participantSignal.seatPositionStyle.seatCoordinates.top}px`
            }}
            onMouseEnter={() => {
              setHoveredParticipantID(`${participantSignal.id}`);
            }}
            onMouseLeave={() => {
              setHoveredParticipantID('');
            }}
          >
            <div className="togetherMode-item">
              {participantSignal?.reaction?.reactionType && (
                <div
                  style={moveAnimationStyles(
                    participantSignal.seatPositionStyle.seatCoordinates.height ?? 1 / 2, // dividing by two because reactionOverlayStyle height is set to 50%
                    (participantSignal.seatPositionStyle.seatCoordinates.height ?? 1 / 2) * (1 - 0.7 * 0.95)
                  )}
                >
                  <div
                    style={{
                      width: `${REACTION_START_DISPLAY_SIZE}px`,
                      left: `${(100 - (REACTION_START_DISPLAY_SIZE / (participantSignal.seatPositionStyle.seatCoordinates.width ?? 1)) * 100) / 2}%`,
                      position: 'absolute'
                    }}
                  >
                    <div
                      style={spriteAnimationStyles(
                        REACTION_NUMBER_OF_ANIMATION_FRAMES,
                        REACTION_START_DISPLAY_SIZE,
                        (participantSignal.reaction &&
                          getEmojiResource(participantSignal?.reaction.reactionType, reactionResources)) ??
                          ''
                      )}
                    />
                  </div>
                </div>
              )}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  backgroundColor: participantSignal.showDisplayName ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '4px'
                }}
              >
                <Stack
                  horizontal
                  verticalAlign="center"
                  tokens={{ childrenGap: 4 }}
                  style={{
                    position: 'absolute', // Ensure it's positioned absolutely within the parent
                    bottom: 0,
                    left: '50%', // Center horizontally in the parent
                    transform: 'translate(-50%, -50%)', // Adjust position so the element is truly centered
                    overflow: 'visible', // Allow overflow when expanded
                    width: hoveredParticipantID === `${participantSignal.id}` ? 'auto' : '100%' // Ensure the element takes up the full width of the parent
                  }}
                >
                  {participantSignal.isHandRaised && (
                    <Stack className={mergeStyles(iconContainerStyle)}>
                      <Icon iconName="ControlButtonRaiseHand" />
                    </Stack>
                  )}
                  {participantSignal.showDisplayName && (
                    <Text
                      data-ui-id="video-tile-display-name"
                      className={ellipsisTextStyle}
                      style={{
                        overflow: hoveredParticipantID === `${participantSignal.id}` ? 'visible' : 'hidden', // Show content when expanded
                        transition: 'width 0.3s ease' // Smooth transition for width changes
                      }}
                    >
                      {participantSignal.displayName}
                    </Text>
                  )}
                  {participantSignal.showDisplayName && participantSignal.isMuted && (
                    <Stack className={mergeStyles(iconContainerStyle)}>
                      <Icon iconName="VideoTileMicOff" />
                    </Stack>
                  )}
                  {participantSignal.isSpotlighted && (
                    <Stack className={mergeStyles(iconContainerStyle)}>
                      <Icon iconName="VideoTileSpotlighted" />
                    </Stack>
                  )}
                </Stack>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

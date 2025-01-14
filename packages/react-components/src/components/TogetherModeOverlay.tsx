// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useMemo, useState, memo } from 'react';
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
import { REACTION_NUMBER_OF_ANIMATION_FRAMES } from './VideoGallery/utils/reactionUtils';
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
  calculateScaledSize,
  getTogetherModeParticipantOverlayStyle,
  REACTION_MAX_TRAVEL_HEIGHT,
  REACTION_TRAVEL_HEIGHT,
  setTogetherModeSeatPositionStyle,
  togetherModeIconStyle,
  togetherModeParticipantDisplayName,
  togetherModeParticipantEmojiSpriteStyle,
  togetherModeParticipantStatusContainer,
  TogetherModeSeatStyle
} from './styles/TogetherMode.styles';
/* @conditional-compile-remove(together-mode) */
import { CallingTheme, useTheme } from '../theming';
/* @conditional-compile-remove(together-mode) */
import { RaisedHandIcon } from './assets/RaisedHandIcon';
/* @conditional-compile-remove(together-mode) */
import { _pxToRem } from '@internal/acs-ui-common';

/* @conditional-compile-remove(together-mode) */
/**
 * Signaling action overlay component props
 * @internal
 */
type TogetherModeParticipantStatus = {
  reaction?: Reaction;
  scaledSize?: number;
  isHandRaised?: boolean;
  isSpotlighted?: boolean;
  isMuted?: boolean;
  id: string;
  seatPositionStyle: TogetherModeSeatStyle;
  displayName: string;
  showDisplayName: boolean;
};

/* @conditional-compile-remove(together-mode) */
/**
 * TogetherModeOverlay component renders an empty JSX element.
 *
 * @returns {JSX.Element} An empty JSX element.
 */
export const TogetherModeOverlay = memo(
  (props: {
    emojiSize: number;
    reactionResources: ReactionResources;
    localParticipant: VideoGalleryLocalParticipant;
    remoteParticipants: VideoGalleryRemoteParticipant[];
    togetherModeSeatPositions: VideoGalleryTogetherModeParticipantPosition;
  }) => {
    const locale = useLocale();
    const theme = useTheme();
    const callingPalette = (theme as unknown as CallingTheme).callingPalette;

    const { emojiSize, reactionResources, remoteParticipants, localParticipant, togetherModeSeatPositions } = props;
    const [togetherModeParticipantStatus, setTogetherModeParticipantStatus] = useState<{
      [key: string]: TogetherModeParticipantStatus;
    }>({});
    const [hoveredParticipantID, setHoveredParticipantID] = useState('');

    /*
     * The useMemo hook is used to calculate the participant status for the Together Mode overlay.
     * It updates the togetherModeParticipantStatus state when there's a change in the remoteParticipants, localParticipant,
     * raisedHand, spotlight, isMuted, displayName, or hoveredParticipantID.
     */
    useMemo(() => {
      const allParticipants = [...remoteParticipants, localParticipant];

      const participantsWithVideoAvailable = allParticipants.filter(
        (p) => p.videoStream?.isAvailable && togetherModeSeatPositions[p.userId]
      );

      const updatedSignals: { [key: string]: TogetherModeParticipantStatus } = {};
      for (const p of participantsWithVideoAvailable) {
        const { userId, reaction, raisedHand, spotlight, isMuted, displayName } = p;
        const seatingPosition = togetherModeSeatPositions[userId];
        if (seatingPosition) {
          updatedSignals[userId] = {
            id: userId,
            reaction: reactionResources && reaction,
            isHandRaised: !!raisedHand,
            isSpotlighted: !!spotlight,
            isMuted,
            displayName: displayName || locale.strings.videoGallery.displayNamePlaceholder,
            showDisplayName: !!(spotlight || raisedHand || hoveredParticipantID === userId),
            scaledSize: calculateScaledSize(seatingPosition.width, seatingPosition.height),
            seatPositionStyle: setTogetherModeSeatPositionStyle(seatingPosition)
          };
        }
      }

      // This is used to remove the participants bounding box from the DOM when they are no longer in the stream
      const participantsNotInTogetherModeStream = Object.keys(togetherModeParticipantStatus).filter(
        (id) => !updatedSignals[id]
      );

      setTogetherModeParticipantStatus((prevSignals) => {
        const newSignals = { ...prevSignals, ...updatedSignals };

        participantsNotInTogetherModeStream.forEach((id) => {
          delete newSignals[id];
        });

        const hasSignalingChange = Object.keys(newSignals).some(
          (key) => JSON.stringify(newSignals[key]) !== JSON.stringify(prevSignals[key])
        );

        const updateTogetherModeParticipantStatusState =
          hasSignalingChange || Object.keys(newSignals).length !== Object.keys(prevSignals).length;
        return updateTogetherModeParticipantStatusState ? newSignals : prevSignals;
      });
    }, [
      remoteParticipants,
      localParticipant,
      togetherModeParticipantStatus,
      togetherModeSeatPositions,
      reactionResources,
      locale.strings.videoGallery.displayNamePlaceholder,
      hoveredParticipantID
    ]);

    /*
     * When a larger participant scene switches to a smaller group in Together Mode,
     * participant video streams remain available because their video is still active,
     * even though they are not visible in the Together Mode stream.
     * Therefore, we rely on the updated seating position values to identify who is included in the Together Mode stream.
     * The Together mode seat position will only contain seat coordinates of participants who are visible in the Together Mode stream.
     */
    useMemo(() => {
      const removedVisibleParticipants = Object.keys(togetherModeParticipantStatus).filter(
        (participantId) => !togetherModeSeatPositions[participantId]
      );

      setTogetherModeParticipantStatus((prevSignals) => {
        const newSignals = { ...prevSignals };
        removedVisibleParticipants.forEach((participantId) => {
          delete newSignals[participantId];
        });

        // Trigger a re-render only if changes occurred
        const updateTogetherModeParticipantStatusState =
          Object.keys(newSignals).length !== Object.keys(prevSignals).length;
        return updateTogetherModeParticipantStatusState ? newSignals : prevSignals;
      });
    }, [togetherModeParticipantStatus, togetherModeSeatPositions]);

    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {Object.values(togetherModeParticipantStatus).map(
          (participantStatus) =>
            participantStatus.id && (
              <div
                key={participantStatus.id}
                style={{
                  ...getTogetherModeParticipantOverlayStyle(participantStatus.seatPositionStyle)
                }}
                onMouseEnter={() => setHoveredParticipantID(participantStatus.id)}
                onMouseLeave={() => setHoveredParticipantID('')}
              >
                <div>
                  {participantStatus.reaction?.reactionType && (
                    // First div - Section that fixes the travel height and applies the movement animation
                    // Second div - Responsible for ensuring the sprite emoji is always centered in the participant seat position
                    // Third div - Play Animation as the other animation applies on the base play animation for the sprite
                    <div
                      style={moveAnimationStyles(
                        parseFloat(participantStatus.seatPositionStyle.seatPosition.height) *
                          REACTION_MAX_TRAVEL_HEIGHT,
                        parseFloat(participantStatus.seatPositionStyle.seatPosition.height) * REACTION_TRAVEL_HEIGHT
                      )}
                    >
                      <div
                        style={{
                          ...togetherModeParticipantEmojiSpriteStyle(
                            emojiSize,
                            participantStatus.scaledSize || 1,
                            participantStatus.seatPositionStyle.seatPosition.width
                          )
                        }}
                      >
                        <div
                          style={spriteAnimationStyles(
                            REACTION_NUMBER_OF_ANIMATION_FRAMES,
                            participantStatus.scaledSize || 1,
                            (participantStatus.reaction &&
                              getEmojiResource(participantStatus?.reaction.reactionType, reactionResources)) ??
                              ''
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {participantStatus.showDisplayName && (
                    <div>
                      <div
                        style={{
                          ...togetherModeParticipantStatusContainer(
                            callingPalette.videoTileLabelBackgroundLight,
                            theme.effects.roundedCorner4
                          )
                        }}
                      >
                        {participantStatus.isHandRaised && <RaisedHandIcon />}
                        {participantStatus.showDisplayName && (
                          <Text
                            style={{
                              ...togetherModeParticipantDisplayName(
                                hoveredParticipantID === participantStatus.id,
                                parseFloat(participantStatus.seatPositionStyle.seatPosition.width),
                                participantStatus.displayName ? theme.palette.neutralSecondary : 'inherit'
                              )
                            }}
                          >
                            {participantStatus.displayName}
                          </Text>
                        )}
                        {participantStatus.isMuted && (
                          <Stack className={mergeStyles(togetherModeIconStyle)}>
                            <Icon iconName="VideoTileMicOff" />
                          </Stack>
                        )}
                        {participantStatus.isSpotlighted && (
                          <Stack className={mergeStyles(togetherModeIconStyle)}>
                            <Icon iconName="VideoTileSpotlighted" />
                          </Stack>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
        )}
      </div>
    );
  }
);

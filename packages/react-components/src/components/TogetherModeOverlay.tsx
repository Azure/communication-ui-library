// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo, useState, memo, useEffect } from 'react';
import {
  Reaction,
  ReactionResources,
  VideoGalleryTogetherModeParticipantPosition,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant
} from '../types';
import { moveAnimationStyles, spriteAnimationStyles } from './styles/ReactionOverlay.style';
import { REACTION_NUMBER_OF_ANIMATION_FRAMES } from './VideoGallery/utils/reactionUtils';
import { Icon, mergeStyles, Stack, Text } from '@fluentui/react';
import { getEmojiResource } from './VideoGallery/utils/videoGalleryLayoutUtils';
import { useLocale } from '../localization';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';
import {
  calculateScaledSize,
  getTogetherModeParticipantOverlayStyle,
  participantStatusTransitionStyle,
  REACTION_MAX_TRAVEL_HEIGHT,
  REACTION_TRAVEL_HEIGHT,
  setTogetherModeSeatPositionStyle,
  togetherModeIconStyle,
  togetherModeParticipantDisplayName,
  togetherModeParticipantEmojiSpriteStyle,
  togetherModeParticipantStatusContainer,
  TogetherModeSeatStyle
} from './styles/TogetherMode.styles';
import { CallingTheme, useTheme } from '../theming';
import { RaisedHandIcon } from './assets/RaisedHandIcon';
import { _pxToRem } from '@internal/acs-ui-common';

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
    const updatedParticipantStatus = useMemo(() => {
      const allParticipants = [...remoteParticipants, localParticipant];

      const participantsWithVideoAvailable = allParticipants.filter(
        (p) => p.videoStream?.isAvailable && togetherModeSeatPositions[p.userId]
      );

      const updatedSignals: { [key: string]: TogetherModeParticipantStatus } = {};
      for (const p of participantsWithVideoAvailable) {
        const { userId, reaction, raisedHand, spotlight, isMuted } = p;
        const seatingPosition = togetherModeSeatPositions[userId];
        const isLocalParticipant = p.userId === localParticipant.userId;
        const displayName = p.displayName
          ? p.displayName
          : isLocalParticipant
            ? locale.strings.videoGallery.localVideoLabel
            : locale.strings.videoGallery.displayNamePlaceholder;
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

      const newSignals = { ...togetherModeParticipantStatus, ...updatedSignals };

      participantsNotInTogetherModeStream.forEach((id) => {
        delete newSignals[id];
      });

      const hasSignalingChange = Object.keys(newSignals).some(
        (key) => JSON.stringify(newSignals[key]) !== JSON.stringify(togetherModeParticipantStatus[key])
      );

      const updateTogetherModeParticipantStatusState =
        hasSignalingChange || Object.keys(newSignals).length !== Object.keys(togetherModeParticipantStatus).length;
      return updateTogetherModeParticipantStatusState ? newSignals : togetherModeParticipantStatus;
    }, [
      remoteParticipants,
      localParticipant,
      togetherModeParticipantStatus,
      togetherModeSeatPositions,
      reactionResources,
      locale.strings.videoGallery.localVideoLabel,
      locale.strings.videoGallery.displayNamePlaceholder,
      hoveredParticipantID
    ]);

    useEffect(() => {
      if (hoveredParticipantID && !updatedParticipantStatus[hoveredParticipantID]) {
        setHoveredParticipantID('');
      }

      setTogetherModeParticipantStatus(updatedParticipantStatus);
    }, [hoveredParticipantID, updatedParticipantStatus]);

    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
        {Object.values(togetherModeParticipantStatus).map(
          (participantStatus) =>
            participantStatus.id && (
              <div
                key={participantStatus.id}
                data-ui-id={`together-mode-participant-${participantStatus.id}`}
                style={{
                  ...getTogetherModeParticipantOverlayStyle(participantStatus.seatPositionStyle)
                }}
                onMouseEnter={() => setHoveredParticipantID(participantStatus.id)}
                onMouseLeave={() => setHoveredParticipantID('')}
              >
                <div>
                  {participantStatus.showDisplayName && (
                    <div style={{ ...participantStatusTransitionStyle }}>
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
                        data-ui-id={`together-mode-participant-reaction-${participantStatus.id}`}
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
                </div>
              </div>
            )
        )}
      </div>
    );
  }
);

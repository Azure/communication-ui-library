// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useMemo, useState } from 'react';
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
  setTogetherModeSeatPositionStyle,
  togetherModeIconStyle,
  togetherModeParticipantDisplayName,
  togetherModeParticipantStatusContainer,
  TogetherModeSeatStyle
} from './styles/TogetherMode.styles';
import { CallingTheme, useTheme } from '../theming';
// import { iconContainerStyle, raiseHandContainerStyles } from './styles/VideoTile.styles';
import { RaisedHandIcon } from './assets/RaisedHandIcon';
/* @conditional-compile-remove(together-mode) */
import { _pxToRem } from '@internal/acs-ui-common';
/* @conditional-compile-remove(together-mode) */
/**
 * Signaling action overlay component props
 *
 * Can be used with {@link VideoTile}.
 *
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
export const TogetherModeOverlay = React.memo(
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

    useMemo(() => {
      const removedVisibleParticipants = Object.keys(togetherModeParticipantStatus).filter(
        (participantId) => !togetherModeSeatPositions[participantId]
      );
      // Update visible signals state instead of directly mutating it
      setTogetherModeParticipantStatus((prevSignals) => {
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
    }, [togetherModeParticipantStatus, togetherModeSeatPositions]);

    useMemo(() => {
      const allParticipants = [...remoteParticipants, localParticipant];

      const participantsWithVideoAvailable = allParticipants.filter(
        (p) => p.videoStream?.isAvailable && togetherModeSeatPositions[p.userId]
      );
      const updatedSignals = participantsWithVideoAvailable.reduce(
        (acc: { [key: string]: TogetherModeParticipantStatus }, p: VideoGalleryLocalParticipant) => {
          const { userId, reaction, raisedHand, spotlight, isMuted, displayName } = p;
          const seatingPosition = togetherModeSeatPositions[userId];
          if (seatingPosition) {
            acc[userId] = {
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
          return acc;
        },
        {}
      );

      const participantsNotInTogetherModeStream = Object.keys(togetherModeParticipantStatus).filter(
        (id) => !updatedSignals[id]
      );

      setTogetherModeParticipantStatus((prevSignals) => {
        const newSignals = { ...prevSignals, ...updatedSignals };
        const newSignalsLength = Object.keys(newSignals).length;
        participantsNotInTogetherModeStream.forEach((id) => {
          delete newSignals[id];
        });

        const hasChanges = Object.keys(newSignals).some(
          (key) =>
            JSON.stringify(newSignals[key]) !== JSON.stringify(prevSignals[key]) ||
            newSignalsLength !== Object.keys(prevSignals).length
        );

        return hasChanges ? newSignals : prevSignals;
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

    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {Object.values(togetherModeParticipantStatus).map((participantStatus) => (
          <div
            key={participantStatus.id}
            style={{
              ...getTogetherModeParticipantOverlayStyle(participantStatus.seatPositionStyle),
              border: '1px solid blue'
            }}
            onMouseEnter={() => setHoveredParticipantID(participantStatus.id)}
            onMouseLeave={() => setHoveredParticipantID('')}
          >
            <div>
              {participantStatus.reaction?.reactionType && (
                <div
                  style={moveAnimationStyles(
                    parseFloat(participantStatus.seatPositionStyle.seatPosition.height) * 0.5 * 16,
                    parseFloat(participantStatus.seatPositionStyle.seatPosition.height) * 0.35 * 16
                  )}
                >
                  <div
                    style={{
                      width: `${emojiSize}`,
                      position: 'absolute',
                      left: `${
                        (100 -
                          ((participantStatus.scaledSize || 1) /
                            (parseFloat(participantStatus.seatPositionStyle.seatPosition.width) * 16)) *
                            100) /
                        2
                      }%`
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
                <div
                  style={{
                    position: 'absolute',
                    bottom: `${_pxToRem(2)}`,
                    width: 'fit-content',
                    textAlign: 'center',
                    border: '1px solid white',
                    transform: 'translate(-50%)',
                    transition: 'width 0.3s ease, transform 0.3s ease',
                    left: '50%'
                  }}
                >
                  <div
                    style={{
                      ...togetherModeParticipantStatusContainer(
                        callingPalette.videoTileLabelBackgroundLight,
                        theme.effects.roundedCorner4
                      )
                    }}
                  >
                    {participantStatus.isHandRaised && (
                      <span
                        style={{
                          ...togetherModeIconStyle()
                        }}
                      >
                        <RaisedHandIcon />
                      </span>
                    )}
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
                      <span>
                        <Icon
                          iconName="VideoTileMicOff"
                          style={{
                            ...togetherModeIconStyle(),
                            color: participantStatus.displayName ? theme.palette.neutralSecondary : 'inherit'
                          }}
                        />
                      </span>
                    )}
                    {participantStatus.isSpotlighted && (
                      <span>
                        <Icon
                          iconName="VideoTileSpotlighted"
                          style={{
                            ...togetherModeIconStyle(),
                            color: participantStatus.displayName ? theme.palette.neutralSecondary : 'inherit'
                          }}
                        />
                      </span>
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

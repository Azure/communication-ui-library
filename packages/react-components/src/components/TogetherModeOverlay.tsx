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
import { _pxToRem, _remToPx } from '@internal/acs-ui-common';
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
    const [visibleSignals, setVisibleSignals] = useState<{ [key: string]: TogetherModeParticipantStatus }>({});
    const [hoveredParticipantID, setHoveredParticipantID] = useState('');

    const hideSignalForParticipantsNotInTogetherMode = useCallback(() => {
      const removedVisibleParticipants = Object.keys(visibleSignals).filter(
        (participantId) => !togetherModeSeatPositions[participantId]
      );
      // Update visible signals state instead of directly mutating it
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
    }, [visibleSignals, togetherModeSeatPositions]);

    const Testing = useCallback(() => {
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
              reaction,
              isHandRaised: !!raisedHand,
              isSpotlighted: !!spotlight,
              isMuted,
              displayName: displayName || locale.strings.videoGallery.displayNamePlaceholder,
              showDisplayName: !!(spotlight || raisedHand || reaction || hoveredParticipantID === userId),
              scaledSize: calculateScaledSize(seatingPosition.width, seatingPosition.height),
              seatPositionStyle: setTogetherModeSeatPositionStyle(seatingPosition)
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
      togetherModeSeatPositions,
      locale.strings.videoGallery.displayNamePlaceholder,
      hoveredParticipantID
    ]);

    // Trigger updates on dependency changes
    useEffect(() => {
      Testing();
      hideSignalForParticipantsNotInTogetherMode();
    }, [
      remoteParticipants,
      localParticipant,
      hoveredParticipantID,
      Testing,
      hideSignalForParticipantsNotInTogetherMode
    ]);

    return (
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        {Object.values(visibleSignals).map((participantSignal) => (
          <div
            key={participantSignal.id}
            style={{
              ...getTogetherModeParticipantOverlayStyle(participantSignal.seatPositionStyle),
              border: '1px solid red'
            }}
            onMouseEnter={() => setHoveredParticipantID(participantSignal.id)}
            onMouseLeave={() => setHoveredParticipantID('')}
          >
            <div>
              {participantSignal.reaction?.reactionType && (
                <div
                  style={moveAnimationStyles(
                    _remToPx(participantSignal.seatPositionStyle.seatPosition.height) * 0.5,
                    _remToPx(participantSignal.seatPositionStyle.seatPosition.height) * 0.35
                  )}
                >
                  <div
                    style={{
                      width: `${emojiSize}`,
                      position: 'absolute',
                      left: `${
                        (100 -
                          ((participantSignal.scaledSize || 1) /
                            _remToPx(participantSignal.seatPositionStyle.seatPosition.width)) *
                            100) /
                        2
                      }%`
                    }}
                  >
                    <div
                      style={spriteAnimationStyles(
                        REACTION_NUMBER_OF_ANIMATION_FRAMES,
                        participantSignal.scaledSize || 1,
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
                    bottom: `${_pxToRem(2)}`,
                    width: '100%',
                    textAlign: 'center'
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
                    {participantSignal.isHandRaised && (
                      <span
                        style={{
                          ...togetherModeIconStyle()
                        }}
                      >
                        <RaisedHandIcon />
                      </span>
                    )}
                    {participantSignal.showDisplayName && (
                      <Text
                        style={{
                          ...togetherModeParticipantDisplayName(
                            hoveredParticipantID === participantSignal.id,
                            _remToPx(participantSignal.seatPositionStyle.seatPosition.width),
                            participantSignal.displayName ? theme.palette.neutralSecondary : 'inherit'
                          )
                        }}
                      >
                        {participantSignal.displayName}
                      </Text>
                    )}
                    {participantSignal.isMuted && (
                      <Icon
                        iconName="VideoTileMicOff"
                        style={{
                          ...togetherModeIconStyle(),
                          color: participantSignal.displayName ? theme.palette.neutralSecondary : 'inherit'
                        }}
                      />
                    )}
                    {participantSignal.isSpotlighted && (
                      <Icon
                        iconName="VideoTileSpotlighted"
                        style={{
                          ...togetherModeIconStyle(),
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

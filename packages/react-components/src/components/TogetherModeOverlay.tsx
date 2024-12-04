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
import { spriteAnimationStyles } from './styles/ReactionOverlay.style';
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
            showDisplayName: !!(participant.spotlight || participant.raisedHand || participant.reaction),
            seatPositionStyle: togetherModeSeatStyle
          }
        }));
      },
      [locale.strings.videoGallery.displayNamePlaceholder, participantsSeatingArrangement]
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
          pointerEvents: 'none',
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
          >
            <div className="togetherMode-item">
              {
                <div
                  style={{
                    width: `${REACTION_START_DISPLAY_SIZE}px`,
                    top: `${(100 - (REACTION_START_DISPLAY_SIZE / (participantSignal.seatPositionStyle.seatCoordinates.height ?? 1)) * 100) / 2}%`,
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
              }
              <div>
                <Stack horizontal>
                  <Stack horizontal>
                    {participantSignal.isHandRaised && (
                      <Stack className={mergeStyles(iconContainerStyle)}>
                        <Icon iconName="ControlButtonRaiseHand" />
                      </Stack>
                    )}
                    {participantSignal.showDisplayName && (
                      <Text title={participantSignal.displayName} data-ui-id="video-tile-display-name">
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
                </Stack>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

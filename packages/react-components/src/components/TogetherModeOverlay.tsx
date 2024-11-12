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
  VideoGalleryRemoteParticipant,
  VideoGalleryTogetherModeSeatingInfo
} from '../types';
/* @conditional-compile-remove(together-mode) */
import {
  getReactionStyleBucket,
  IReactionStyleBucket,
  ITogetherModeReactionStyleBucket,
  moveAnimationStyles,
  // opacityAnimationStyles,
  spriteAnimationStyles
} from './styles/ReactionOverlay.style';
/* @conditional-compile-remove(together-mode) */
import {
  // getCombinedKey,
  REACTION_NUMBER_OF_ANIMATION_FRAMES,
  REACTION_START_DISPLAY_SIZE
} from './VideoGallery/utils/reactionUtils';
/* @conditional-compile-remove(together-mode) */
import { mergeStyles, Stack } from '@fluentui/react';
/* @conditional-compile-remove(together-mode) */
import { videoContainerStyles } from './styles/VideoTile.styles';
/* @conditional-compile-remove(together-mode) */
import { getEmojiResource } from './VideoGallery/utils/videoGalleryLayoutUtils';
/* @conditional-compile-remove(together-mode) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(together-mode) */
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';

/* @conditional-compile-remove(together-mode) */
/**
 * Reaction overlay component props
 *
 * Can be used with {@link VideoTile}.
 *
 * @internal
 */
type VisibleTogetherModeReaction = {
  reaction?: Reaction;
  isHandRaised?: boolean;
  isSpotlighted?: boolean;
  isMuted?: boolean;
  id?: string;
  styleBucket?: ITogetherModeReactionStyleBucket;
  displayName?: string;
  showDisplayName?: boolean;
};

/* @conditional-compile-remove(together-mode) */
// type ReceivedReaction = {
//   id: string;
//   status: 'animating' | 'completedAnimating' | 'ignored';
// };

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
    // Reactions that are currently being animated
    // const [visibleReactions, setVisibleReactions] = useState<VisibleTogetherModeReaction[]>([]);
    const [visibleSignals, setVisibleSignals] = useState<Record<string, VisibleTogetherModeReaction>>({});

    // Dictionary of userId to a reaction status. This is used to track the latest received reaction
    // per user to avoid animating the same reaction multiple times and to limit the number of
    // active reactions of a certain type.
    // const latestReceivedReaction = useRef<Record<string, ReceivedReaction>>({});

    const participantsSignals: Record<string, VisibleTogetherModeReaction> = useMemo(() => {
      const signals: Record<string, VisibleTogetherModeReaction> = {};
      remoteParticipants?.map((particpant) => {
        const participantID = particpant.userId;
        const togetherModeSeatStyle: ITogetherModeReactionStyleBucket = {
          sizeScale: 0.9,
          opacityMax: 0.9,
          width: participantsSeatingArrangement?.[participantID]?.width ?? 0,
          height: participantsSeatingArrangement?.[participantID]?.height ?? 0,
          left: participantsSeatingArrangement?.[participantID]?.left ?? 0,
          top: participantsSeatingArrangement?.[participantID]?.top ?? 0
        };
        signals[participantID] = {
          id: participantID,
          reaction: particpant.reaction,
          isHandRaised: !!particpant.raisedHand,
          isSpotlighted: !!particpant.spotlight,
          isMuted: particpant.isMuted,
          displayName: !particpant?.displayName
            ? locale.strings.videoGallery.displayNamePlaceholder
            : particpant?.displayName,
          styleBucket: togetherModeSeatStyle
        };
      });
      if (localParticipant) {
        const togetherModeSeatStyle: ITogetherModeReactionStyleBucket = {
          sizeScale: 0.9,
          opacityMax: 0.9,
          width: participantsSeatingArrangement?.[localParticipant.userId]?.width ?? 0,
          height: participantsSeatingArrangement?.[localParticipant.userId]?.height ?? 0,
          left: participantsSeatingArrangement?.[localParticipant.userId]?.left ?? 0,
          top: participantsSeatingArrangement?.[localParticipant.userId]?.top ?? 0
        };
        signals[localParticipant.userId] = {
          id: localParticipant.userId,
          reaction: localParticipant.reaction,
          isHandRaised: !!localParticipant.raisedHand,
          isSpotlighted: !!localParticipant.spotlight,
          isMuted: localParticipant.isMuted,
          displayName: !localParticipant?.displayName
            ? locale.strings.videoGallery.displayNamePlaceholder
            : localParticipant?.displayName,
          styleBucket: togetherModeSeatStyle
        };
      }
      return signals;
    }, [
      remoteParticipants,
      localParticipant,
      locale.strings.videoGallery.displayNamePlaceholder,
      participantsSeatingArrangement
    ]);

    const updateTogetherModeSeatingUI = useCallback(
      (
        participant: VideoGalleryLocalParticipant | VideoGalleryRemoteParticipant,
        seatingPosition: VideoGalleryTogetherModeSeatingInfo
      ): void => {
        // const combinedKey = getCombinedKey(userId, reaction.reactionType, reaction.receivedOn);

        // const alreadyHandled = latestReceivedReaction.current[userId]?.id === combinedKey;
        // if (alreadyHandled) {
        //   return;
        // }

        const participantID = participant.userId;
        const togetherModeSeatStyle: ITogetherModeReactionStyleBucket = {
          sizeScale: 0.9,
          opacityMax: 0.9,
          width: seatingPosition.width,
          height: seatingPosition.height,
          left: seatingPosition.left,
          top: seatingPosition.top
        };

        // removeVisibleSignalinDiv(participantID);
        setVisibleSignals((prevVisibleSignals) => ({
          ...prevVisibleSignals,
          [participant.userId]: {
            id: participantID,
            reaction: participant.reaction,
            isHandRaised: !!participant.raisedHand,
            isSpotlighted: !!participant.spotlight,
            isMuted: participant.isMuted,
            displayName: participant.displayName || locale.strings.videoGallery.displayNamePlaceholder,
            showDisplayName: !!(
              participant.isMuted ||
              participant.spotlight ||
              participant.raisedHand ||
              participant.reaction
            ),
            styleBucket: togetherModeSeatStyle
          }
        }));
        return;
      },
      [locale.strings.videoGallery.displayNamePlaceholder]
    );

    // const removeVisibleSignalinDiv = (id: string): void => {
    //   document.getElementById(id)?.remove();
    // };

    // Update visible reactions when remote participants send a reaction
    useEffect(() => {
      remoteParticipants?.map((participant) => {
        if (participant.videoStream?.isAvailable) {
          const seatingPosition = participantsSeatingArrangement?.[participant.userId];
          seatingPosition && updateTogetherModeSeatingUI(participant, seatingPosition);
        }
      });
      if (localParticipant && localParticipant.videoStream?.isAvailable) {
        const seatingPosition = participantsSeatingArrangement?.[localParticipant.userId];
        seatingPosition && updateTogetherModeSeatingUI(localParticipant, seatingPosition);
      }
    }, [
      remoteParticipants,
      localParticipant,
      participantsSeatingArrangement,
      updateTogetherModeSeatingUI,
      participantsSignals
    ]);

    const styleBucket = (): IReactionStyleBucket => getReactionStyleBucket();
    const displaySizePx = (): number => REACTION_START_DISPLAY_SIZE * styleBucket().sizeScale;
    return (
      <Stack
        className={mergeStyles(videoContainerStyles, {
          backgroundColor: 'transparent'
        })}
      >
        {Object.values(visibleSignals).map((participantSignal) => (
          <div
            key={participantSignal.id}
            style={{
              position: 'absolute',
              width: `${participantSignal.styleBucket?.width ?? 0}px`,
              height: `${participantSignal.styleBucket?.height ?? 0}px`,
              top: `${participantSignal.styleBucket?.top ?? 0}px`,
              left: `${participantSignal.styleBucket?.left ?? 0}px`
            }}
          >
            <div className="reaction-item">
              {
                // First div - Section that fixes the travel height and applies the movement animation
                // Second div - Keeps track of active sprites and responsible for marking, counting
                //              and removing reactions. Responsible for opacity controls as the sprite emoji animates
                // Third div - Responsible for calculating the point of X axis where the reaction will start animation
                // Fourth div - Play Animation as the other animation applies on the base play animation for the sprite
                <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
                  <div
                    style={moveAnimationStyles(
                      (participantSignal.styleBucket?.height ?? 0) / 2, // dividing by two because reactionOverlayStyle height is set to 50%
                      ((participantSignal.styleBucket?.height ?? 0) / 2) * (1 - 0.7 * 0.95)
                    )}
                  >
                    <div>
                      <div
                        style={spriteAnimationStyles(
                          REACTION_NUMBER_OF_ANIMATION_FRAMES,
                          displaySizePx(),
                          (participantSignal.reaction &&
                            getEmojiResource(participantSignal?.reaction.reactionType, reactionResources)) ??
                            ''
                        )}
                      />
                    </div>
                  </div>
                </div>
              }
              <div
                style={{
                  color: `white`,
                  textAlign: 'center',
                  backgroundColor: 'black',
                  display: 'inline-block',
                  position: 'absolute',
                  bottom: '0px',
                  marginLeft: '50%'
                }}
              >
                <div style={{ marginRight: `2px` }}>
                  <div>
                    {participantSignal.isHandRaised && (
                      <_HighContrastAwareIcon disabled={true} iconName="ControlButtonRaiseHand" />
                    )}
                    {participantSignal.showDisplayName && participantSignal.displayName}
                    {participantSignal.isMuted && <_HighContrastAwareIcon disabled={true} iconName={'Muted'} />}
                    {participantSignal.isSpotlighted && (
                      <_HighContrastAwareIcon disabled={true} iconName={'ControlButtonExitSpotlight'} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Stack>
    );
  }
);

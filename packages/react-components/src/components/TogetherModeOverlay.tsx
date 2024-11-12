// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
/* @conditional-compile-remove(together-mode) */
import {
  Reaction,
  ReactionResources,
  VideoGalleryTogetherModeParticipantPosition,
  VideoGalleryLocalParticipant,
  VideoGalleryRemoteParticipant
} from '../types';
/* @conditional-compile-remove(together-mode) */
import {
  getReactionStyleBucket,
  IReactionStyleBucket,
  ITogetherModeReactionStyleBucket,
  opacityAnimationStyles,
  spriteAnimationStyles
} from './styles/ReactionOverlay.style';
/* @conditional-compile-remove(together-mode) */
import {
  getCombinedKey,
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
  reaction: Reaction;
  id: string;
  styleBucket: ITogetherModeReactionStyleBucket;
  displayName?: string;
};

// /**
//  * Reaction overlay component props
//  *
//  * Can be used with {@link VideoTile}.
//  *
//  * @internal
//  */
// type VisibleSignaling = {
//   isHandRaised?: boolean;
//   isSpotlighted?: boolean;
//   styleBucket: ITogetherModeReactionStyleBucket;
//   displayName?: string;
// };

/* @conditional-compile-remove(together-mode) */
type ReceivedReaction = {
  id: string;
  status: 'animating' | 'completedAnimating' | 'ignored';
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
    // Reactions that are currently being animated
    const [visibleReactions, setVisibleReactions] = useState<VisibleTogetherModeReaction[]>([]);
    // const [pinDisplayName, setPinDisplayName] = useState<Record<string, boolean>>({});

    // Dictionary of userId to a reaction status. This is used to track the latest received reaction
    // per user to avoid animating the same reaction multiple times and to limit the number of
    // active reactions of a certain type.
    const latestReceivedReaction = useRef<Record<string, ReceivedReaction>>({});

    const particpantsReactions: Reaction[] = useMemo(() => {
      const reactions =
        remoteParticipants
          ?.map((remoteParticipant) => remoteParticipant.reaction)
          .filter((reaction): reaction is Reaction => !!reaction) ?? [];
      if (localParticipant?.reaction) {
        reactions.push(localParticipant.reaction);
      }
      return reactions;
    }, [remoteParticipants, localParticipant]);

    // const participantsRaiseHand: Record<string, boolean> = useMemo(() => {
    //   const raiseHandParticipants: Record<string, boolean> = {};
    //   remoteParticipants?.forEach((participant) => {
    //     if (participant.raisedHand) {
    //       raiseHandParticipants[participant.userId] = true;
    //     }
    //   });
    //   if (localParticipant?.raisedHand) {
    //     raiseHandParticipants[localParticipant.userId] = true;
    //   }
    //   return raiseHandParticipants;
    // }, [localParticipant, remoteParticipants]);

    // const participantsSpotlight: Record<string, boolean> = useMemo(() => {
    //   const spotlightParticipants: Record<string, boolean> = {};
    //   remoteParticipants?.forEach((participant) => {
    //     if (participant.spotlight) {
    //       spotlightParticipants[participant.userId] = true;
    //     }
    //   });
    //   if (localParticipant?.spotlight) {
    //     spotlightParticipants[localParticipant.userId] = true;
    //   }
    //   return spotlightParticipants;
    // }, [localParticipant, remoteParticipants]);

    const updateVisibleReactions = useCallback(
      (
        reaction: Reaction,
        userId: string,
        displayName: string,
        seatingPosition: { width: number; height: number; top: number; left: number }
      ): void => {
        const combinedKey = getCombinedKey(userId, reaction.reactionType, reaction.receivedOn);

        const alreadyHandled = latestReceivedReaction.current[userId]?.id === combinedKey;
        if (alreadyHandled) {
          return;
        }

        const reactionStyle: ITogetherModeReactionStyleBucket = {
          sizeScale: 0.9,
          opacityMax: 0.9,
          width: seatingPosition.width,
          height: seatingPosition.height,
          left: seatingPosition.left,
          top: seatingPosition.top
        };

        latestReceivedReaction.current[userId] = {
          id: combinedKey,
          status: 'animating'
        };

        setVisibleReactions([
          ...visibleReactions,
          {
            reaction: reaction,
            id: combinedKey,
            displayName: displayName,
            styleBucket: reactionStyle
          }
        ]);
        return;
      },
      [visibleReactions]
    );

    const removeVisibleReaction = (reactionType: string, id: string): void => {
      setVisibleReactions(visibleReactions.filter((reaction) => reaction.id !== id));
      Object.entries(latestReceivedReaction.current).forEach(([userId, reaction]) => {
        const userLastReaction = latestReceivedReaction.current[userId];
        if (reaction.id === id && userLastReaction) {
          userLastReaction.status = 'completedAnimating';
        }
      });
    };

    // Update visible reactions when remote participants send a reaction
    useEffect(() => {
      remoteParticipants?.map((participant) => {
        if (participant?.reaction && participant.videoStream?.isAvailable) {
          const seatingPosition = participantsSeatingArrangement?.[participant.userId];
          const displayName = !participant?.displayName
            ? locale.strings.videoGallery.displayNamePlaceholder
            : participant?.displayName;
          seatingPosition &&
            updateVisibleReactions(participant.reaction, participant.userId, displayName, seatingPosition);
        }
      });
      if (localParticipant?.reaction && localParticipant.videoStream?.isAvailable) {
        const seatingPosition = participantsSeatingArrangement?.[localParticipant.userId];
        const displayName = !localParticipant?.displayName
          ? locale.strings.videoGallery.displayNamePlaceholder
          : localParticipant?.displayName;
        seatingPosition &&
          updateVisibleReactions(localParticipant.reaction, localParticipant.userId, displayName, seatingPosition);
      }
    }, [
      locale.strings.videoGallery.displayNamePlaceholder,
      particpantsReactions,
      remoteParticipants,
      localParticipant,
      updateVisibleReactions,
      participantsSeatingArrangement
    ]);

    const styleBucket = (): IReactionStyleBucket => getReactionStyleBucket();
    const displaySizePx = (): number => REACTION_START_DISPLAY_SIZE * styleBucket().sizeScale;
    return (
      <Stack
        className={mergeStyles(videoContainerStyles, {
          backgroundColor: 'transparent'
        })}
      >
        {visibleReactions.map((reaction) => (
          <div
            key={reaction.id}
            style={{
              position: 'absolute',
              width: `${reaction.styleBucket.width}px`,
              height: `${reaction.styleBucket.height}px`,
              top: `${reaction.styleBucket.top}px`,
              left: `${reaction.styleBucket.left}px`
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
                    onAnimationEnd={() => {
                      removeVisibleReaction(reaction.reaction.reactionType, reaction.id);
                    }}
                    style={opacityAnimationStyles(reaction.styleBucket.opacityMax)}
                  >
                    <div>
                      <div
                        style={spriteAnimationStyles(
                          REACTION_NUMBER_OF_ANIMATION_FRAMES,
                          displaySizePx(),
                          getEmojiResource(reaction?.reaction.reactionType, reactionResources) ?? ''
                        )}
                      />
                    </div>
                  </div>
                </div>
              }
              {/* <div style={{ border: `1px solid black`, color: `white`, textAlign: 'center', backgroundColor: 'black' }}>
                <div>
                  <_HighContrastAwareIcon disabled={false} iconName="ControlButtonRaiseHand" />
                </div>
                <div>{reaction.displayName}</div>
                <div>
                  <_HighContrastAwareIcon iconName={'Muted'} />
                  <_HighContrastAwareIcon iconName={'ControlButtonExitSpotlight'} />
                </div>
              </div> */}
            </div>
          </div>
        ))}
      </Stack>
    );
  }
);

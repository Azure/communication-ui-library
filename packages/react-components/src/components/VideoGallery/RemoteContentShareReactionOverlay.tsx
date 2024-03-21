// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
/* @conditional-compile-remove(reaction) */
import { Reaction, ReactionResources, VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '../../types';
/* @conditional-compile-remove(reaction) */
import { Stack, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import { videoContainerStyles } from '../styles/VideoTile.styles';
/* @conditional-compile-remove(reaction) */
import { getEmojiResource } from './utils/videoGalleryLayoutUtils';
/* @conditional-compile-remove(reaction) */
import {
  IReactionStyleBucket,
  generateStartPositionWave,
  getReactionMovementStyle,
  getReactionStyleBucket,
  moveAnimationStyles,
  opacityAnimationStyles,
  reactionOverlayStyle,
  spriteAnimationStyles
} from '../styles/ReactionOverlay.style';

/* @conditional-compile-remove(reaction) */
type ReactionStateType = {
  reaction: Reaction;
  id?: string;
  url?: string;
};

/* @conditional-compile-remove(reaction) */
/**
 * Reaction overlay component for presentation mode
 *
 * Can be used with {@link MeetingReactionOverlay}.
 *
 * @internal
 */
export const RemoteContentShareReactionOverlay = React.memo(
  (props: {
    reactionResources: ReactionResources;
    localParticipant?: VideoGalleryLocalParticipant;
    remoteParticipants?: VideoGalleryRemoteParticipant[];
    hostDivHeight?: number;
    hostDivWidth?: number;
  }) => {
    const { reactionResources, localParticipant, remoteParticipants, hostDivHeight, hostDivWidth } = props;

    const REACTION_START_DISPLAY_SIZE = 44;
    const REACTION_NUMBER_OF_ANIMATION_FRAMES = 51;
    const [visibleReactions, setVisibleReactions] = useState<ReactionStateType[]>([]);
    const [isCurrentlyActive, setIsCurrentlyActive] = useState<string[]>([]);
    const [activeTypeCount, setActiveTypeCount] = useState([
      { reactionType: 'like', count: 0 },
      { reactionType: 'heart', count: 0 },
      { reactionType: 'laugh', count: 0 },
      { reactionType: 'applause', count: 0 },
      { reactionType: 'surprised', count: 0 }
    ]);

    const getReceivedUnixTime = (receivedTime: Date): number => {
      return Math.floor(receivedTime.getTime() / 1000);
    };

    const getCombinedKey = (userId: string, reactionType: string, receivedAt: Date): string => {
      const receivedTime =
        receivedAt.getFullYear() +
        ':' +
        receivedAt.getMonth() +
        ':' +
        receivedAt.getDay() +
        ':' +
        receivedAt.getHours() +
        ':' +
        receivedAt.getMinutes() +
        ':' +
        receivedAt.getSeconds() +
        ':' +
        receivedAt.getMilliseconds();

      return userId + reactionType + receivedTime;
    };

    const remoteParticipantReactions = useMemo(
      () => remoteParticipants?.map((remoteParticipant) => remoteParticipant.reaction),
      [remoteParticipants]
    );

    const markAsCurrentlyActive = (reaction: Reaction, id: string): void => {
      setIsCurrentlyActive([...isCurrentlyActive, id]);

      setActiveTypeCount((prevActiveCounts) =>
        prevActiveCounts.map((item) =>
          item.reactionType === reaction.reactionType ? { ...item, count: item.count + 1 } : item
        )
      );
    };

    const shouldRender = (id: string): boolean => {
      if (id === '') {
        return false;
      }
      const isFirstTime = isCurrentlyActive.find((prevId) => prevId === id);
      console.log('Mohtasim - isReceivedForFirstTime ' + isFirstTime);
      return isFirstTime === undefined;
    };

    const updateVisibleReactions = useCallback(
      (reaction: Reaction, userId: string): boolean => {
        const combinedKey = getCombinedKey(userId, reaction.reactionType, reaction.receivedOn);
        console.log('Mohtasim - combined key ' + combinedKey);
        const isInQueue = visibleReactions.findIndex((reaction) => reaction.id === combinedKey);
        if (isInQueue !== -1) {
          return false;
        }

        const activeCountItem = activeTypeCount.find((item) => item.reactionType === reaction.reactionType);
        const activeCount = activeCountItem === undefined ? 0 : activeCountItem.count;
        if (activeCount > 10) {
          return false;
        }

        setVisibleReactions([...visibleReactions, { reaction: reaction, id: combinedKey }]);

        return true;
      },
      [activeTypeCount, visibleReactions]
    );

    const removeVisibleReaction = (reactionType: string, id: string): void => {
      console.log('Mohtasim - trying to remove with id ' + id);
      visibleReactions.filter((reaction) => reaction.id !== id);
      isCurrentlyActive.filter((item) => item !== id);
      setActiveTypeCount((prevActiveCounts) =>
        prevActiveCounts.map((item) => (item.reactionType === reactionType ? { ...item, count: item.count - 1 } : item))
      );
    };

    useEffect(() => {
      if (localParticipant?.reaction !== undefined) {
        updateVisibleReactions(localParticipant.reaction, localParticipant.userId);
      }

      remoteParticipants?.map((participant) => {
        if (participant?.reaction !== undefined) {
          updateVisibleReactions(participant.reaction, participant.userId);
        }
      });
    }, [
      localParticipant?.reaction,
      localParticipant?.userId,
      remoteParticipantReactions,
      remoteParticipants,
      updateVisibleReactions
    ]);

    const cleanupIfGarbage = (reaction: Reaction | undefined, id: string): void => {
      if (reaction?.reactionType) {
        removeVisibleReaction(reaction?.reactionType, id);
      }
    };

    const canRenderReaction = (reaction: Reaction | undefined, id: string): boolean => {
      if (reaction === undefined) {
        return false;
      }
      const currentTimestamp = new Date();
      const currentUnixTimeStamp = Math.floor(currentTimestamp.getTime() / 1000);
      const receivedUnixTimestamp = reaction ? getReceivedUnixTime(reaction.receivedOn) : 0;
      const canRender = receivedUnixTimestamp ? currentUnixTimeStamp - receivedUnixTimestamp < 4133 : false;
      if (!canRender) {
        cleanupIfGarbage(reaction, id);
      }
      return canRender;
    };

    const containerHeight = hostDivHeight ?? 0;
    const containerWidth = hostDivWidth ?? REACTION_START_DISPLAY_SIZE - REACTION_START_DISPLAY_SIZE;

    const styleBucket = (activeSprites: number): IReactionStyleBucket => getReactionStyleBucket(activeSprites);
    const displaySizePx = (activeSprites: number): number =>
      REACTION_START_DISPLAY_SIZE * styleBucket(activeSprites).sizeScale;

    const leftPosition = (position: number): number =>
      generateStartPositionWave(position, containerWidth / 2, true /* isOriginAtCanvasCenter */);
    const reactionMovementStyle = (position: number): React.CSSProperties =>
      getReactionMovementStyle(leftPosition(position));

    return (
      <Stack
        className={mergeStyles(videoContainerStyles, {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        })}
      >
        {visibleReactions.map((reaction, index) => (
          <div key={reaction.reaction.reactionType + index} style={reactionOverlayStyle}>
            <div className="reaction-item">
              <React.Fragment key={reaction.id ?? reaction?.reaction.receivedOn.getMilliseconds()}>
                {canRenderReaction(reaction.reaction, reaction.id ?? '') && shouldRender(reaction.id ?? '') && (
                  // First div - Section that fixes the travel height and applies the movement animation
                  // Second div - Keeps track of active sprites and responsible for marking, counting and removing reactions
                  // Third div - Responsible for opacity controls as the sprite emoji animates
                  // Fourth div - Responsible for calculating the point of X axis where the reaction will start animation
                  // Fifth div - Play Animation as the other animation applies on the base play animation for the sprite
                  <div
                    style={moveAnimationStyles(
                      containerHeight,
                      containerHeight * (1 - styleBucket(isCurrentlyActive.length).heightMaxScale)
                    )}
                  >
                    <div
                      onAnimationEnd={() => removeVisibleReaction(reaction.reaction.reactionType, reaction.id ?? '')}
                      onAnimationStart={() => markAsCurrentlyActive(reaction.reaction, reaction.id ?? '')}
                    >
                      <div style={opacityAnimationStyles(styleBucket(isCurrentlyActive.length).opacityMax)}>
                        <div style={reactionMovementStyle(index)}>
                          <div
                            style={spriteAnimationStyles(
                              REACTION_NUMBER_OF_ANIMATION_FRAMES,
                              displaySizePx(isCurrentlyActive.length),
                              getEmojiResource(reaction?.reaction.reactionType ?? '', reactionResources) ?? ''
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            </div>
          </div>
        ))}
      </Stack>
    );
  }
);

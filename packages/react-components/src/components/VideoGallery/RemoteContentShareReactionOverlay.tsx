// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import React, { useEffect, useMemo, useState } from 'react';
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
    const [isCurrentlyActive, setIsCurrentlyActive] = useState(new Map<string, number>());
    const [isAlreadyInQueue, setIsAlreadyInQueue] = useState(new Map<string, boolean>());
    const [activeTypeCount, setActiveTypeCount] = useState([
      { reactionType: 'like', count: 0 },
      { reactionType: 'heart', count: 0 },
      { reactionType: 'laugh', count: 0 },
      { reactionType: 'applause', count: 0 },
      { reactionType: 'surprised', count: 0 }
    ]);

    const getReceivedUnixTime = (receivedTime: Date) => {
      return Math.floor(receivedTime.getTime() / 1000);
    };

    const getCombinedKey = (userId: string, reactionType: string, receivedAt: Date) => {
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

    const markAsCurrentlyActive = (reaction: Reaction, id: string) => {
      setIsCurrentlyActive((prevIsCurrentlyActive) => new Map([...prevIsCurrentlyActive, [id, 1]]));

      setActiveTypeCount((prevActiveCounts) =>
        prevActiveCounts.map((item) =>
          item.reactionType === reaction.reactionType ? { ...item, count: item.count + 1 } : item
        )
      );
    };

    const checkIsCurrentlyActive = (reaction: Reaction, id: string) => {
      if (isCurrentlyActive.get(id) !== undefined) {
        return isCurrentlyActive.has(id);
      }
      return false;
    };

    const updateVisibleReactions = (reaction: Reaction, userId: string) => {
      const combinedKey = getCombinedKey(userId, reaction.reactionType, reaction.receivedOn);

      if (isAlreadyInQueue[combinedKey] !== undefined) {
        return isAlreadyInQueue[combinedKey];
      }

      const activeCountItem = activeTypeCount.find((item) => item.reactionType === reaction.reactionType);
      const activeCount = activeCountItem === undefined ? 0 : activeCountItem.count;
      if (activeCount > 10) {
        return false;
      }

      setVisibleReactions((prevReactions) => [...prevReactions, { reaction: reaction, id: combinedKey }]);
      setIsAlreadyInQueue((prevQueue) => {
        const newMap = new Map(prevQueue);
        newMap[combinedKey] = true;
        return newMap;
      });

      return true;
    };

    const removeVisibleReaction = (reactionType: string, combinedKey: string) => {
      console.log('Removing reactions');
      setVisibleReactions((prevReactions) => prevReactions.filter((reaction) => reaction.id !== combinedKey));
      setIsAlreadyInQueue((prevQueue) => {
        const newMap = new Map(prevQueue);
        newMap[combinedKey] = false;
        return newMap;
      });
      setIsCurrentlyActive((prevIsCurrentlyActive) => {
        const activeReactions = new Map(prevIsCurrentlyActive);
        activeReactions.delete(combinedKey);
        return activeReactions;
      });
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
    }, [localParticipant?.reaction, localParticipant?.userId, remoteParticipantReactions]);

    const getRidOfOlderReactions = (reactionType: string, id: string) => {
      removeVisibleReaction(reactionType, id);
    };

    const canRenderReaction = (reaction: Reaction | undefined, id: string): boolean => {
      if (reaction === undefined) {
        return false;
      }
      const currentTimestamp = new Date();
      const currentUnixTimeStamp = Math.floor(currentTimestamp.getTime() / 1000);
      const receivedUnixTimestamp = reaction ? getReceivedUnixTime(reaction.receivedOn) : 0;
      const canRender = receivedUnixTimestamp ? currentUnixTimeStamp - receivedUnixTimestamp < 500 : false;
      if (!canRender) {
        getRidOfOlderReactions(reaction.reactionType, id);
      }
      return canRender;
    };

    const containerHeight = hostDivHeight ?? 0;
    const containerWidth = hostDivWidth ?? REACTION_START_DISPLAY_SIZE - REACTION_START_DISPLAY_SIZE;

    const styleBucket = (activeSprites: number) => getReactionStyleBucket(activeSprites);
    const displaySizePx = (activeSprites: number) => REACTION_START_DISPLAY_SIZE * styleBucket(activeSprites).sizeScale;

    const leftPosition = (position: number) =>
      generateStartPositionWave(position, containerWidth / 2, true /* isOriginAtCanvasCenter */);
    const reactionMovementStyle = (position: number) => getReactionMovementStyle(leftPosition(position));

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
          <div style={reactionOverlayStyle}>
            <div key={reaction.id ?? reaction.reaction.receivedOn.getMilliseconds()} className="reaction-item">
              <React.Fragment key={reaction.id ?? reaction.reaction.receivedOn.getMilliseconds()}>
                {canRenderReaction(reaction.reaction, reaction.id ?? '') &&
                  !checkIsCurrentlyActive(reaction.reaction, reaction.id ?? '') && (
                    // First div - Section that fixes the travel height and applies the movement animation
                    // Second div - Keeps track of active sprites and responsible for marking, counting and removing reactions
                    // Third div - Responsible for opacity controls as the sprite emoji animates
                    // Fourth div - Responsible for calculating the point of X axis where the reaction will start animation
                    // Fifth div - Play Animation as the other animation applies on the base play animation for the sprite
                    <div
                      style={moveAnimationStyles(
                        containerHeight,
                        containerHeight * (1 - styleBucket(isCurrentlyActive.size).heightMaxScale)
                      )}
                    >
                      <div
                        onAnimationEnd={() => removeVisibleReaction(reaction.reaction.reactionType, reaction.id ?? '')}
                        onAnimationStart={() => markAsCurrentlyActive(reaction.reaction, reaction.id ?? '')}
                      >
                        <div style={opacityAnimationStyles(styleBucket(isCurrentlyActive.size).opacityMax)}>
                          <div style={reactionMovementStyle(index)}>
                            <div
                              style={spriteAnimationStyles(
                                REACTION_NUMBER_OF_ANIMATION_FRAMES,
                                displaySizePx(isCurrentlyActive.size),
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

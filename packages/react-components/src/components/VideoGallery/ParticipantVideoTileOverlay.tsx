// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import React, { useCallback, useEffect, useState } from 'react';
/* @conditional-compile-remove(reaction) */
import { Reaction, ReactionResources } from '../../types';
/* @conditional-compile-remove(reaction) */
import { getEmojiResource } from './utils/videoGalleryLayoutUtils';
/* @conditional-compile-remove(reaction) */
import { Stack, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import { reactionRenderingStyle, videoContainerStyles } from '../styles/VideoTile.styles';

/* @conditional-compile-remove(reaction) */
export const ParticipantVideoTileOverlay = React.memo(
  (props: { reaction?: Reaction; reactionResources: ReactionResources; emojiSize?: number }) => {
    const { reaction, reactionResources, emojiSize = 44 } = props;
    const [isValidImageSource, setIsValidImageSource] = useState<boolean>(false);

    const backgroundImageUrl =
      reaction !== undefined && reactionResources !== undefined
        ? getEmojiResource(reaction?.reactionType, reactionResources)
        : '';
    const currentTimestamp = new Date();
    const currentUnixTimeStamp = Math.floor(currentTimestamp.getTime() / 1000);
    const receivedUnixTimestamp = reaction ? Math.floor(reaction.receivedAt.getTime() / 1000) : undefined;
    const canRenderReaction =
      (receivedUnixTimestamp ? currentUnixTimeStamp - receivedUnixTimestamp < 3000 : false) &&
      backgroundImageUrl !== undefined;

    useEffect(() => {
      if (!backgroundImageUrl || backgroundImageUrl.length === 0) {
        return;
      }

      fetch(`${backgroundImageUrl}`)
        .then((res) => {
          setIsValidImageSource(res.ok);
        })
        .catch((warning) => console.warn(`Sprite image for animation rendering failed with warning: ${warning}`));

      return () => setIsValidImageSource(false);
    }, [backgroundImageUrl]);

    const spriteImageUrl = backgroundImageUrl !== undefined ? backgroundImageUrl : '';
    const reactionContainerStyles = useCallback(
      () =>
        reactionRenderingStyle({
          spriteImageUrl,
          emojiSize: emojiSize
        }),
      [spriteImageUrl, emojiSize]
    );

    return (
      <Stack
        className={mergeStyles(videoContainerStyles, {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: canRenderReaction ? 'rgba(0, 0, 0, 0.5)' : 'transparent'
        })}
      >
        <div style={{ height: '33.33%' }}></div>
        {canRenderReaction && isValidImageSource && (
          <div style={{ height: '84px', width: '84px' }}>
            <div className={reactionContainerStyles()} />
          </div>
        )}
      </Stack>
    );
  }
);

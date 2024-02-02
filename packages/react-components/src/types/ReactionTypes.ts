// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Type for animation sprite image and related metadata
 * @beta
 */
export type ReactionSprite = {
  /**
   * Path to animation sprite image for reaction.
   */
  url: string; // base64, relative links, relative paths
  /**
   * The frame count of the resource reaction in the sprite image
   */
  frameCount: number;
  /**
   * The square size of one frame in the animation resource..
   */
  size?: number;
};

/**
 * Interface for animation sprite image and related metadata
 * @beta
 */
export interface ReactionResources {
  /**
   * Like reaction animation resource.
   */
  likeReaction?: ReactionSprite;
  /**
   * Heart reaction animation resource.
   */
  heartReaction?: ReactionSprite;
  /**
   * Laugh reaction animation resource.
   */
  laughReaction?: ReactionSprite;
  /**
   * Applause reaction animation resource.
   */
  applauseReaction?: ReactionSprite;
  /**
   * Surprised reaction animation resource.
   */
  surprisedReaction?: ReactionSprite;
}

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Type for animation sprite image and related metadata
 * @beta
 */
export type ReactionResourceParams = {
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
  likeReaction?: ReactionResourceParams;
  /**
   * Heart reaction animation resource.
   */
  heartReaction?: ReactionResourceParams;
  /**
   * Laugh reaction animation resource.
   */
  laughReaction?: ReactionResourceParams;
  /**
   * Applause reaction animation resource.
   */
  applauseReaction?: ReactionResourceParams;
  /**
   * Surprised reaction animation resource.
   */
  surprisedReaction?: ReactionResourceParams;
}

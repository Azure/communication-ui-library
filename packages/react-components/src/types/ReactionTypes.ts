// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Type for animation sprite image and related metadata
 * @public
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
};

/**
 * Interface for animation sprite image and related metadata
 * @public
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

/**
 * Options for overlay mode for reaction rendering
 * @internal
 */
export type OverlayModeTypes = 'grid-tiles' | 'screen-share' | 'content-share' | 'together-mode';

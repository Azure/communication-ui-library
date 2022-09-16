// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Strings used by the {@link ChatComposite} directly.
 *
 * This strings are in addition to those used by the components from the component library.
 *
 * @public
 */
export interface ChatCompositeStrings {
  /**
   * Chat list header text
   */
  chatListHeader: string;

  /* @conditional-compile-remove(file-sharing) */
  /**
   * Upload File Button text
   */
  uploadFile: string;
}

const defaultBetaOnlyStrings = {
  /**
   * Delete after stabilization of: file-sharing
   */
  uploadFile: ''
};

/**
 * @private
 */
export type BuildFlavorAgnosticChatCompositeStrings = ChatCompositeStrings &
  Record<keyof typeof defaultBetaOnlyStrings, string>;

/**
 * @private
 */
export function buildFlavorAgnosticChatCompositeStrings(
  strings: ChatCompositeStrings
): BuildFlavorAgnosticChatCompositeStrings {
  // First provide defaults, and then override with incoming strings.
  // This ensurs that for beta builds, the incoming strings are respected.
  return {
    ...defaultBetaOnlyStrings,
    ...strings
  };
}

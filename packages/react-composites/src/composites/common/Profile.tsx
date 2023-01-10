// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AvatarPersonaData } from './AvatarPersona';

/**
 * Custom data attributes for displaying avatar for a user.
 *
 * @public
 */
export type Profile = {
  /**
   * Primary text to display, usually the name of the person.
   */
  displayName?: string;
  avatarPersonaData?: AvatarPersonaData;
};

/**
 * Callback function used to provide custom data to build profile for a user.
 *
 * @public
 */
export type OnFetchProfileCallback = (userId: string) => Promise<Profile | undefined>;

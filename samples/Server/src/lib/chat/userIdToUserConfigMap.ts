// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

interface UserConfig {
  emoji: string;
  displayName?: string;
  id: string;
}

// This is for samples only.
// All User information (name, profile image) are stored in memory only and deleted when the server restarts
export const userIdToUserConfigMap = new Map<string, UserConfig>();

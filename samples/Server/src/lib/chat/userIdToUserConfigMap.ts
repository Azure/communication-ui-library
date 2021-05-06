// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

interface UserConfig {
  emoji: string;
  displayName?: string;
  id: string;
}

export const userIdToUserConfigMap = new Map<string, UserConfig>();

// © Microsoft Corporation. All rights reserved.

interface UserConfig {
  emoji: string;
  displayName?: string;
  id: string;
}

export const userIdToUserConfigMap = new Map<string, UserConfig>();

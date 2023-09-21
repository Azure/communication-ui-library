// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

interface UserConfig {
  emoji: string;
  displayName?: string;
  id: string;
}

// For the purpose of this sample, we opted to use an in-memory data store.
// This means that if the web application is restarted any information maintained would be wiped.
// For longer term storage solutions we suggest referring to this document -> https://docs.microsoft.com/en-us/azure/architecture/guide/technology-choices/data-store-decision-tree
export const userIdToUserConfigMap = new Map<string, UserConfig>();

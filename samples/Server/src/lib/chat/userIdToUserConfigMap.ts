// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

interface UserConfig {
  emoji: string;
  displayName?: string;
  id: string;
}

// For the purpose of this sample, we opted to use an in-memory data store.
// This means that if the web application is restarted any information maintained would be wiped.
// For longer term storage solutions we suggest using Azure Blob Storage (https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)
export const userIdToUserConfigMap = new Map<string, UserConfig>();

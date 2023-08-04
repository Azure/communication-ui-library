// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export type CheckBreakingChanges<OLD, NEW extends OLD> = NEW;

// These are the list we intentionally make breaking changes,
// we will still check removed property and property names/types compatibility,
// But it will skip the check for new properties in the interface (and we don't consider them as breaking change)
export type ExcludeList =
  | 'GetCallingSelector'
  | 'getCallingSelector'
  | 'getChatSelector'
  | 'GetChatSelector'
  | 'usePropsFor'
  | 'useAzureCommunicationCallWithChatAdapter'
  | 'CallWithChatComposite'
  | 'useAzureCommunicationCallAdapter'
  | 'CallComposite'
  | 'useAzureCommunicationChatAdapter'
  | 'ChatComposite';

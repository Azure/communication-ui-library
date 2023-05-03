// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export type CheckBreakingChanges<OLD, NEW extends OLD> = NEW;

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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import ChatComposite from './ChatComposite';
export type { GroupChatProps, GroupChatOptions } from './ChatComposite';
export {
  AzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapter
} from './adapter/AzureCommunicationChatAdapter';

export type {
  GroupChatState,
  GroupChatClientState,
  GroupChatUIState,
  GroupChatAdapter
} from './adapter/GroupChatAdapter';
export { ChatComposite };

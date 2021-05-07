// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import ChatComposite from './ChatComposite';
export {
  AzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapter
} from './adapter/AzureCommunicationChatAdapter';

export type { GroupChatState, GroupChatAdapter } from './adapter/GroupChatAdapter';
export { ChatComposite };

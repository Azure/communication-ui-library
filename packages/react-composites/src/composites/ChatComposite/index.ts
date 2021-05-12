// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import ChatComposite from './ChatComposite';
export {
  AzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapter
} from './adapter/AzureCommunicationChatAdapter';

export type { ChatState, ChatAdapter } from './adapter/ChatAdapter';
export { ChatComposite };

// © Microsoft Corporation. All rights reserved.
export { chatClientDeclaratify } from './ChatClientDeclarative';
export { chatThreadClientDeclaratify } from './ChatThreadClientDeclarative';

import { DeclarativeChatClient as _DeclarativeChatClient } from './ChatClientDeclarative';
import { ChatMessageWithStatus as _ChatMessageWithStatus } from './types/ChatMessageWithStatus';

import {
  ChatThreadClientState as _ChatThreadClientState,
  ChatClientState as _ChatClientState
} from './ChatClientState';

export type DeclarativeChatClient = _DeclarativeChatClient;
export type ChatThreadClientState = _ChatThreadClientState;
export type ChatMessageWithStatus = _ChatMessageWithStatus;
export type ChatClientState = _ChatClientState;

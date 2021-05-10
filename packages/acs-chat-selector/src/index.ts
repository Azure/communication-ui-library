// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { communicationIdentifierToString } from './baseSelectors';
export { chatThreadSelector } from './chatThreadSelector';
export { sendBoxSelector } from './sendBoxSelector';
export { chatParticipantListSelector } from './chatParticipantListSelector';
export { typingIndicatorSelector } from './typingIndicatorSelector';

export { ChatClientProvider, useChatClient } from './providers/ChatClientProvider';
export { ChatThreadClientProvider, useChatThreadClient, useThreadId } from './providers/ChatThreadClientProvider';

export type { ChatClientProviderProps } from './providers/ChatClientProvider';
export type { ChatThreadClientProviderProps } from './providers/ChatThreadClientProvider';

export { usePropsFor } from './hooks/usePropsFor';
export { useSelector } from './hooks/useSelector';
export { useHandlers } from './hooks/useHandlers';

export { createDefaultHandlersForComponent, createDefaultHandlers } from './handlers/createHandlers';
export type {
  ChatMessagePayload,
  SystemMessagePayload,
  CustomMessagePayload,
  ChatMessage,
  SystemMessage,
  CustomMessage,
  Message,
  MessageTypes,
  MessageAttachedStatus
} from './types/UiChatMessage';
export { memoizeFnAll } from './utils/memoizeFnAll';
export type { FunctionWithKey, CallbackType } from './utils/memoizeFnAll';
export type { BaseSelectorProps } from './baseSelectors';
export type { DefaultHandlers, CommonProperties } from './handlers/createHandlers';
export type { WebUiChatParticipant } from './types/WebUiChatParticipant';

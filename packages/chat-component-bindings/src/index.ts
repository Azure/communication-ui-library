// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { createDefaultChatHandlers, createDefaultChatHandlersForComponent } from './handlers/createHandlers';
export { ChatClientProvider, useChatClient } from './providers/ChatClientProvider';
export { ChatThreadClientProvider, useChatThreadClient } from './providers/ChatThreadClientProvider';
export { usePropsFor as useChatPropsFor, getSelector as getChatSelector } from './hooks/usePropsFor';
export { useSelector as useChatSelector } from './hooks/useSelector';
export { useHandlers as useChatHandlers } from './hooks/useHandlers';

export type { ChatClientProviderProps } from './providers/ChatClientProvider';
export type { ChatThreadClientProviderProps } from './providers/ChatThreadClientProvider';
export type { ChatBaseSelectorProps } from './baseSelectors';
export type { ChatHandlers } from './handlers/createHandlers';
export type { GetSelector as GetChatSelector } from './hooks/usePropsFor';

export type { MessageThreadSelector } from './messageThreadSelector';
export type { SendBoxSelector } from './sendBoxSelector';
export type { ChatParticipantListSelector } from './chatParticipantListSelector';
export type { TypingIndicatorSelector } from './typingIndicatorSelector';
export type { ErrorBarSelector } from './errorBarSelector';

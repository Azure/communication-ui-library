// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { communicationIdentifierToString } from './baseSelectors';
export { createDefaultChatHandlers, createDefaultChatHandlersForComponent } from './handlers/createHandlers';
export { ChatClientProvider, useChatClient } from './providers/ChatClientProvider';
export { ChatThreadClientProvider, useChatThreadClient, useThreadId } from './providers/ChatThreadClientProvider';
export { usePropsFor } from './hooks/usePropsFor';
export { useSelector } from './hooks/useSelector';

// -- TODO: these exports should be removed in favor of useSelector -- //
export { useHandlers } from './hooks/useHandlers';
export { chatThreadSelector } from './chatThreadSelector';
export { typingIndicatorSelector } from './typingIndicatorSelector';
export { sendBoxSelector } from './sendBoxSelector';
export { chatParticipantListSelector } from './chatParticipantListSelector';
// ---- //

export type { ChatClientProviderProps } from './providers/ChatClientProvider';
export type { ChatThreadClientProviderProps } from './providers/ChatThreadClientProvider';
export type { ChatBaseSelectorProps } from './baseSelectors';
export type { DefaultChatHandlers } from './handlers/createHandlers';
export type { GetSelector } from './hooks/usePropsFor';
export type { AreEqual } from './hooks/usePropsFor';

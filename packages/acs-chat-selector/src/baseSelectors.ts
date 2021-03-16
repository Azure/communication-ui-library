// © Microsoft Corporation. All rights reserved.
import { ChatClientState, ChatMessageWithStatus } from '@azure/acs-chat-declarative';
export type BaseChatConfigProps = {
  displayName: string;
  userId: string;
  threadId: string;
};

export const getSelectorProps = <T>(_: ChatClientState, props: T): T => props;
export const getChatMessages = (
  state: ChatClientState,
  props: BaseChatConfigProps
): Map<string, ChatMessageWithStatus> =>
  (props.threadId && state.threads.get(props.threadId)?.chatMessages) || new Map();

export const getCoolPeriod = (state: ChatClientState, props: BaseChatConfigProps): Date | undefined =>
  props.threadId ? state.threads.get(props.threadId)?.coolPeriod : undefined;

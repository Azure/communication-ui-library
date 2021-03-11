import { ChatClientState } from '@azure/acs-chat-declarative';
export type SelectorProps = {
  displayName?: string;
  userId?: string;
  threadId?: string;
};
export const getDisplayName = (state: ChatClientState) => state.displayName;
export const getSelectorProps = (_: ChatClientState, props: SelectorProps) => props;
export const getChatMessages = (state: ChatClientState, props: SelectorProps) =>
  (props.threadId && state.threads.get(props.threadId)?.chatMessages) || new Map();

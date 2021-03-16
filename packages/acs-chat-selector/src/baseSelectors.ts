import { ChatClientState } from '@azure/acs-chat-declarative';
export type BaseChatConfigProps = {
  displayName: string;
  userId: string;
  threadId: string;
};

export const getDisplayName = (state: ChatClientState) => state.displayName;
export const getSelectorProps = <T>(_: ChatClientState, props: T) => props;
export const getChatMessages = (state: ChatClientState, props: BaseChatConfigProps) =>
  (props.threadId && state.threads.get(props.threadId)?.chatMessages) || new Map();

export const getCoolPeriod = (state: ChatClientState, props: BaseChatConfigProps) =>
  (props.threadId && state.threads.get(props.threadId)?.coolPeriod) || -1;

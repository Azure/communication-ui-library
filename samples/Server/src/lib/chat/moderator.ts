import { createUserToken } from '../createUserToken';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { ChatClient, CreateChatThreadRequest, ChatThreadClient } from '@azure/communication-chat';
import { getEnvUrl } from '../envHelper';
import { GUID_FOR_INITIAL_TOPIC_NAME } from '../constants';
import { threadIdToModeratorTokenMap } from './threadIdToModeratorTokenMap';
import { CommunicationUserToken } from '@azure/communication-administration';

export type ModeratorConfig = {
  token: CommunicationUserToken;
  chatClient: ChatClient | undefined;
  chatThreadClient: ChatThreadClient | undefined;
};
export const moderatorConfig: ModeratorConfig = {
  token: undefined,
  chatClient: undefined,
  chatThreadClient: undefined
};

export const initModerator = async (): Promise<void> => {
  moderatorConfig.token = await createUserToken();
  const credential = new AzureCommunicationUserCredential(moderatorConfig.token.token);
  moderatorConfig.chatClient = new ChatClient(getEnvUrl(), credential);
};

export const getChatClientFromUserToken = async (token: CommunicationUserToken): Promise<ChatClient> => {
  const credential = new AzureCommunicationUserCredential(token.token);
  const chatClient = new ChatClient(getEnvUrl(), credential);
  return chatClient;
};

export const createThread = async (topicName?: string): Promise<string> => {
  const token: CommunicationUserToken = await createUserToken();
  const chatClient = await getChatClientFromUserToken(token);
  const request: CreateChatThreadRequest = {
    topic: topicName ?? GUID_FOR_INITIAL_TOPIC_NAME,
    members: [{ user: { communicationUserId: token.user.communicationUserId } }]
  };
  const chatThreadClient = await chatClient.createChatThread(request);
  threadIdToModeratorTokenMap.set(chatThreadClient.threadId, token);
  return chatThreadClient.threadId;
};

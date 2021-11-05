import { CommunicationIdentityClient, CommunicationUserToken } from '@azure/communication-identity';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';

export type IdentityType = {
  userId: string;
  token: string;
  endpointUrl: string;
  displayName: string;
  threadId: string;
  topic: string;
};

const CONNECTION_STRING = process.env.CONNECTION_STRING ?? '';
const TOPIC_NAME = 'topic name';

export const createChatThreadAndUsers = async (displayNames: string[]): Promise<Array<IdentityType>> => {
  const endpointUrl = new URL(CONNECTION_STRING.replace('endpoint=', '').split(';')[0]).toString();
  const tokenClient = new CommunicationIdentityClient(CONNECTION_STRING);
  const userAndTokens: CommunicationUserToken[] = [];
  for (let i = 0; i < displayNames.length; i++) {
    userAndTokens.push(await tokenClient.createUserAndToken(['chat', 'voip']));
  }

  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAndTokens[0].token));
  const threadId = (await chatClient.createChatThread({ topic: TOPIC_NAME })).chatThread?.id ?? '';
  await chatClient.getChatThreadClient(threadId).addParticipants({
    participants: displayNames.map((displayName, i) => ({ id: userAndTokens[i].user, displayName: displayName }))
  });

  return displayNames.map((displayName, i) => ({
    userId: userAndTokens[i].user.communicationUserId,
    token: userAndTokens[i].token,
    endpointUrl,
    displayName,
    threadId,
    topic: TOPIC_NAME
  }));
};

export const encodeQueryData = (user: IdentityType, qArgs?: { [key: string]: string }): string => {
  const qs: Array<string> = [];
  for (const d in user) {
    qs.push(encodeURIComponent(d) + '=' + encodeURIComponent(user[d]));
  }
  if (qArgs !== undefined) {
    Object.entries(qArgs).forEach(([key, value]) => qs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value)));
  }
  return qs.join('&');
};

// Contoso server to create a new user and thread.

import { GroupCallLocator } from '@azure/communication-calling';
import { ChatClient, ChatParticipant } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { v1 as createGUID } from 'uuid';

const createNewChatThread = async (chatClient: ChatClient, participants: ChatParticipant[]): Promise<string> => {
  const chatThreadResponse = await chatClient.createChatThread(
    { topic: 'Meeting with a remote participant' },
    { participants }
  );
  if (chatThreadResponse.invalidParticipants && chatThreadResponse.invalidParticipants.length > 0) {
    throw 'Server could not add participants to the chat thread';
  }

  const chatThread = chatThreadResponse.chatThread;
  if (!chatThread || !chatThread.id) {
    throw 'Server could not create chat thread';
  }

  return chatThread.id;
};

export const createCallWithChat = async (
  token: string,
  userId: string,
  endpointUrl: string,
  displayName: string
): Promise<{ callLocator: GroupCallLocator; chatThreadId: string }> => {
  const locator = { groupId: createGUID() };
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));
  const threadId = await createNewChatThread(chatClient, [
    { id: { communicationUserId: userId }, displayName: displayName }
  ]);

  return {
    callLocator: locator,
    chatThreadId: threadId
  };
};

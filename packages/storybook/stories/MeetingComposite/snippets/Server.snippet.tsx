// Contoso server to create a new user and thread.

import { ChatClient, ChatParticipant } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { v1 as createGUID } from 'uuid';
import { MeetingExampleProps } from './Meeting.snippet';

const getChatThreadFromTeamsLink = (teamsMeetingLink: string): string => {
  // Get the threadId from the url - this also contains the call locator ID that will be removed in the threadId.split
  let threadId = teamsMeetingLink.replace('https://teams.microsoft.com/l/meetup-join/', '');
  // Decode characters that outlook links encode
  threadId = threadId.replaceAll('%3a', ':').replace('%40', '@');
  // Extract just the chat guid from the link, stripping away the call locator ID
  threadId = threadId.split(/^(.*?@thread\.v2)/gm)[1];

  if (!threadId || threadId.length === 0) throw 'Could not get chat thread from teams link';

  return threadId;
};

const createNewChatThread = async (chatClient: ChatClient, participants: ChatParticipant[]): Promise<string> => {
  const chatThreadResponse = await chatClient.createChatThread(
    { topic: 'Meeting with a friendly bot' },
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

export const createCallLocator = async (
  token: string,
  userId: string,
  endpointUrl: string,
  displayName: string,
  teamsMeetingLink?: string
): Promise<MeetingExampleProps> => {
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));

  const locator = teamsMeetingLink ? { meetingLink: teamsMeetingLink } : { groupId: createGUID() };

  const user = { communicationUserId: userId };

  const threadId = teamsMeetingLink
    ? getChatThreadFromTeamsLink(teamsMeetingLink)
    : await createNewChatThread(chatClient, [{ id: user, displayName: displayName }]);

  return {
    userId: user,
    token,
    displayName,
    endpointUrl,
    locator,
    threadId
  };
};

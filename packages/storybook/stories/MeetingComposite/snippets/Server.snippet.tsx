// Contoso server to create a new user and thread.

import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { v1 as createGUID } from 'uuid';
import { MeetingExampleProps } from './Meeting.snippet';

export const createUserCredentials = async (
  resourceConnectionString: string,
  displayName: string,
  teamsMeetingLink?: string
): Promise<MeetingExampleProps> => {
  const tokenClient = new CommunicationIdentityClient(resourceConnectionString);
  const { user, token } = await tokenClient.createUserAndToken(['voip', 'chat']);
  const endpointUrl = new URL(resourceConnectionString.replace('endpoint=', '').split(';')[0]).toString();
  const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));

  const locator = teamsMeetingLink ? { meetingLink: teamsMeetingLink } : { groupId: createGUID() };

  let threadId: string;
  if (teamsMeetingLink) {
    // Get the threadId from the url - this also contains the call locator ID that will be removed in the threadId.split
    threadId = teamsMeetingLink.replace('https://teams.microsoft.com/l/meetup-join/', '');
    // Decode characters that outlook links encode
    threadId = threadId.replace('%3a', ':').replace('%40', '@');
    // Extract just the chat guid from the link, stripping away the call locator ID
    threadId = threadId.split(/^(.*?@thread\.v2)/gm)[1];
  } else {
    threadId = (await chatClient.createChatThread({ topic: 'DemoMeeting' })).chatThread?.id ?? '';
    await chatClient.getChatThreadClient(threadId).addParticipants({
      participants: [{ id: user, displayName: displayName }]
    });
    await chatClient.getChatThreadClient(threadId).updateTopic('Meeting with a friendly bot');
  }

  return {
    userId: user,
    token,
    displayName,
    endpointUrl,
    locator,
    threadId
  };
};

import { SendChatMessageResult, SendMessageOptions, SendMessageRequest } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatClientState,
  ChatMessageWithStatus,
  createAzureCommunicationChatAdapterFromClient,
  createStatefulChatClient
} from '@azure/communication-react';
import { askAI, ContextItem } from './AIClient';

export const createStatefulClient = async (
  userId: string,
  displayName: string,
  endpoint: string,
  credential: AzureCommunicationTokenCredential,
  threadId: string
): Promise<ChatAdapter> => {
  // Instantiate the statefulChatClient
  const statefulChatClient = await createStatefulChatClient({
    userId: { communicationUserId: userId },
    displayName: displayName || '',
    endpoint: endpoint,
    credential: credential
  });

  // Listen to notifications
  statefulChatClient.startRealtimeNotifications();

  const chatThreadClient = statefulChatClient.getChatThreadClient(threadId);

  chatThreadClient.sendMessage = async (
    request: SendMessageRequest,
    options?: SendMessageOptions | undefined
  ): Promise<SendChatMessageResult> => {
    console.log('stateful sendMessage called!!!!');

    const messages = statefulChatClient.getState().threads[threadId]?.chatMessages;
    const newMessageId = Math.random().toString();
    const newMessage: ChatMessageWithStatus = {
      id: newMessageId,
      type: 'text',
      sequenceId: Math.random().toString(),
      version: 'openAiDeployment',
      createdOn: new Date(),
      content: { message: 'ABCD' },
      status: 'seen'
    };

    parseMessageForAIBeforeSend(request.content, statefulChatClient.getState());

    // Modify the state of statefulChatClient
    // statefulChatClient.modifyState((draft) => {
    //   draft.threads[props.threadId].chatMessages[newMessageId] = newMessage;
    // });

    return { id: newMessageId };
  };

  //   const modifyState = (modifier: (draft: ChatAdapter) => void): void => {
  //     const messages = statefulChatClient.getState().threads[props.threadId]?.chatMessages;
  //     // this._state = produce(this._state, modifier);
  //     // if (this._state !== prior) {
  //     //   this._emitter.emit('stateChanged', this._state);
  //     // }
  //     // const newState = prior.
  //   };
  return await createAzureCommunicationChatAdapterFromClient(statefulChatClient, chatThreadClient);
};

const parseMessageForAIBeforeSend = async (content: string, state: ChatClientState): Promise<string | undefined> => {
  // Look for the token `/bot` in the message content.
  if (content.startsWith('/bot')) {
    // If the token is found, remove it from the message content.
    const msgToBot = content.slice(4).trim();
    // get the history of the thread
    const messages = state.threads?.chatMessages ?? {};
    const displayName = state.displayName;
    const history: ContextItem[] = [];
    for (const [_, message] of Object.entries(messages)) {
      const msg = message as ChatMessageWithStatus;
      history.push({
        senderName: msg.senderDisplayName ?? '',
        content: msg.content?.message ?? ''
      });
    }

    const response = await askAI(msgToBot, displayName, history);
    return response;
    // const botMessage = {
    //   id: Math.random().toString(),
    //   type: 'text' as ChatMessageType,
    //   sequenceId: Math.random().toString(),
    //   version: 'openAiDeployment',
    //   messageType: 'custom',
    //   createdOn: new Date(),
    //   messageId: Math.random().toString(),
    //   content: { message: response }
    // };

    // adapter.getState().thread.chatMessages['bot'] = {
    //   ...botMessage,
    //   status: 'delivered'
    // };

    // return;
  }
  return undefined;
};

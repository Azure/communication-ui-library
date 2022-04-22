// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { graphChatMessageToACSChatMessage, graphParticipantToACSParticipant } from './GraphAcsInteropUtils';
import { getChat, getChatMessages, getChatParticipants, getChats } from './GraphQueries';
import { Thread } from './types';

export class Model {
  private threads: Record<string, Thread> = {};

  public async populateAllThreads(): Promise<void> {
    console.log('getAllThreads');
    const chatsFromGraph = await getChats();
    console.log('chatsFromGraph: ', chatsFromGraph);
    const threadPromises: Promise<Thread>[] = chatsFromGraph.map(async (chat) => {
      console.log('chat: ', chat);

      if (!chat.id) {
        throw new Error('getAllThreads: Chat has no id');
      }
      const messages = (await getChatMessages(chat.id)).map(graphChatMessageToACSChatMessage);
      console.log('messages: ', messages);

      const participants = (await getChatParticipants(chat.id)).map(graphParticipantToACSParticipant);
      console.log('participants: ', participants);

      return {
        id: chat.id,
        topic: chat.topic ?? '',
        createdOn: new Date(chat.createdDateTime ?? 0),
        version: -1,
        participants: participants,
        messages: messages,
        readReceipts: []
      };
    });

    const newThreads = await Promise.all(threadPromises);
    newThreads.forEach((thread) => {
      this.threads[thread.id] = thread;
    });
    console.log('threads: ', this.threads);
  }

  public async populateThread(threadId: string): Promise<void> {
    console.log('getThread');
    const chatFromGraph = await getChat(threadId);
    console.log('chatFromGraph: ', chatFromGraph);

    if (!chatFromGraph.id) {
      throw new Error('getThread: Chat has no id');
    }
    const messages = (await getChatMessages(chatFromGraph.id)).map(graphChatMessageToACSChatMessage);
    console.log('messages: ', messages);
    const participants = (await getChatParticipants(chatFromGraph.id)).map(graphParticipantToACSParticipant);
    console.log('participants: ', participants);

    const thread: Thread = {
      id: chatFromGraph.id,
      topic: chatFromGraph.topic ?? '',
      createdOn: new Date(chatFromGraph.createdDateTime ?? 0),
      version: -1,
      participants: participants,
      messages: messages,
      readReceipts: []
    };

    console.log('thread: ', thread);
    this.threads[thread.id] = thread;
  }

  public getThread(threadId: string): Thread | undefined {
    return this.threads[threadId];
  }

  public getAllThreads(): Thread[] {
    return Object.values(this.threads);
  }
}

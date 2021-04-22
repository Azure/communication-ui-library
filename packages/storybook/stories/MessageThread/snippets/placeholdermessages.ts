import { ChatMessage, CustomMessage, MessageStatus, SystemMessage } from '@azure/communication-ui';

// This is some mock messages for example purposes.
// For actual projects, you can get chat messages from declarative/selectors for ACS.
export const GetHistoryChatMessages = (): ChatMessage[] => {
  return [
    {
      type: 'chat',
      payload: {
        senderId: '1',
        senderDisplayName: 'User1',
        messageId: Math.random().toString(),
        content: 'Hi everyone, I created this awesome group chat for us!',
        createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
        mine: true,
        attached: false,
        statusToRender: 'seen' as MessageStatus
      }
    },
    {
      type: 'chat',
      payload: {
        senderId: '2',
        senderDisplayName: 'User2',
        messageId: Math.random().toString(),
        content: 'Nice! This looks great!',
        createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
        mine: false,
        attached: false
      }
    },
    {
      type: 'chat',
      payload: {
        senderId: '3',
        senderDisplayName: 'User3',
        messageId: Math.random().toString(),
        content: "Yeah agree, let's chat here from now on!",
        createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
        mine: false,
        attached: false
      }
    }
  ];
};

export const GetHistoryWithSystemMessages = (): (SystemMessage | ChatMessage)[] => {
  return [
    ...GetHistoryChatMessages(),
    {
      type: 'system',
      payload: {
        iconName: 'PeopleAdd',
        content: 'User1 is added to the chat'
      }
    }
  ];
};

export const GetHistoryWithCustomMessages = (): (CustomMessage | ChatMessage)[] => {
  return [
    {
      type: 'custom',
      // Custom message's payload can be any shape, this is just an example.
      // Whatever is defined in the custom message's payload needs to be handled in onRenderMessage in MessageThread.
      payload: {
        content: 'Today'
      }
    },
    ...GetHistoryChatMessages()
  ];
};

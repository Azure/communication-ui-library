import { MessageThread, ChatMessage as WebUiChatMessage, SendBox, MessageStatus } from '@azure/communication-ui';
import React from 'react';

export const ChatComponents = (): JSX.Element => {
  //A sample chat history
  const GetHistoryChatMessages = (): WebUiChatMessage[] => {
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

  return (
    <div style={{ height: '30rem', width: '30rem' }}>
      {/* Chat thread component with read receipt feature enabled */}
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} disableReadReceipt={false} />

      <SendBox
        disabled={false}
        onSendMessage={async () => {
          return;
        }}
        onSendTypingNotification={async () => {
          return;
        }}
      />
    </div>
  );
};

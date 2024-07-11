import { usePropsFor, MessageThread, SendBox } from '@azure/communication-react';
import React from 'react';

function ChatComponents(): JSX.Element {
  const messageThreadProps = usePropsFor(MessageThread);
  const sendBoxProps = usePropsFor(SendBox);

  return (
    <div>
      <div style={{ height: '50rem', width: '50rem' }}>
        {/*Props are updated asynchronously, so only render the component once props are populated.*/}
        {messageThreadProps && <MessageThread {...messageThreadProps} />}
      </div>
      {sendBoxProps && <SendBox {...sendBoxProps} />}
    </div>
  );
}

export default ChatComponents;

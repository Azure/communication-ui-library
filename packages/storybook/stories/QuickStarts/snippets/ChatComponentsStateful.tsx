import { usePropsFor, MessageThread, SendBox } from '@azure/communication-react';
import React from 'react';

function ChatComponents(): JSX.Element {
  const messageThreadProps = usePropsFor(MessageThread);
  const sendBoxProps = usePropsFor(SendBox);

  return (
    <div style={{ height: '50em', width: '50em' }}>
      {/*Props are updated asynchronously, so only render the component once props are populated.*/}
      {messageThreadProps && <MessageThread {...messageThreadProps} />}
      {sendBoxProps && <SendBox {...sendBoxProps} />}
    </div>
  );
}

export default ChatComponents;

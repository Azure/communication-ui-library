import {
  FluentThemeProvider,
  MessageThread,
  SendBox,
  MessageThreadProps,
  SendBoxProps
} from '@azure/communication-react';
import React, { useState } from 'react';

function App(): JSX.Element {
  const [messageThreadProps] = useState<MessageThreadProps>();
  const [sendBoxProps] = useState<SendBoxProps>();

  return (
    <FluentThemeProvider>
      <div style={{ height: '50rem', width: '50rem' }}>
        {/*Props are updated asynchronously, so only render the component once props are populated.*/}
        {messageThreadProps && <MessageThread {...messageThreadProps} />}
        {sendBoxProps && <SendBox {...sendBoxProps} />}
      </div>
    </FluentThemeProvider>
  );
}

export default App;

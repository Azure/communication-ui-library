import React, { useState } from 'react';
import { FluentThemeProvider, MessageThread, SendBox, MessageThreadProps, SendBoxProps } from '@azure/communication-ui';
import { chatClientDeclaratify, DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import { sendBoxSelector, chatThreadSelector, createDefaultHandlersForComponent } from '@azure/acs-chat-selector';

function App() {
  const [messageThreadProps, setChatThreadProps] = useState<MessageThreadProps>();
  const [sendBoxProps, setSendBoxProps] = useState<SendBoxProps>();

  return (
    <FluentThemeProvider>
      <div style={{ height: '50rem', width: '50rem' }}>
        {/*Add UI Components with props passed. Render components only when props are populated*/}
        {messageThreadProps && <MessageThread {...messageThreadProps} />}
        {sendBoxProps && <SendBox {...sendBoxProps} />}
      </div>
    </FluentThemeProvider>
  );
}

export default App;

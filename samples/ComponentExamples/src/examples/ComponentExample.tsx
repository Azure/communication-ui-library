// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { MessageThread, SendBox, usePropsFor } from '@azure/communication-react';
import * as React from 'react';

const messageContainerStyle = {
  height: '8rem',
  OverflowY: 'scroll',
  border: 'solid 2px'
};

export const ComponentExample = (): JSX.Element => {
  // usePropsFor will get all the props (including handlers) to run the component
  // Check component list supports usePropsFor() here: https://azure.github.io/communication-ui-library/iframe.html?id=statefulclient-reacthooks-usepropsfor--page&viewMode=story#usepropsfor-chat-app-example
  const sendBoxProps = usePropsFor(SendBox);
  const messageThreadProps = usePropsFor(MessageThread);
  return (
    <>
      <h3>Connect components to StatefulClient</h3>
      <h5>SendBox(send message here and see what happens in MessageThread):</h5>
      <SendBox {...sendBoxProps} />
      <h5>MessageThread:</h5>
      <div style={messageContainerStyle}>
        <MessageThread {...messageThreadProps} />
      </div>
    </>
  );
};

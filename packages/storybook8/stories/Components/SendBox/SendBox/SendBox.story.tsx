// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SendBox as SendBoxComponent } from '@azure/communication-react';
import React, { useEffect, useRef } from 'react';

const SendBoxRender = (args): JSX.Element => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  useEffect(() => {
    // Clean up the timeout when the component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{ width: '31.25rem' }}>
      <SendBoxComponent
        {...args}
        onSendMessage={async (message, options) => {
          timeoutRef.current = setTimeout(() => {
            alert(`Sent message: "${message}" with options: ${JSON.stringify(options)}`);
          }, delayForSendButton);
        }}
        onTyping={() => {
          console.log(`Sending typing notifications`);
          return Promise.resolve();
        }}
        systemMessage={args.hasWarning ? args.warningMessage : undefined}
        attachments={
          args.hasAttachments
            ? [{ id: 'f2d1fce73c98', name: 'file1.txt', progress: 1, url: 'https://www.bing.com' }]
            : undefined
        }
        onCancelAttachmentUpload={(attachmentId) => {
          window.alert(`onCancelAttachmentUpload callback is called for attachment id: "${attachmentId}"`);
        }}
      />
    </div>
  );
};

export const SendBox = SendBoxRender.bind({});

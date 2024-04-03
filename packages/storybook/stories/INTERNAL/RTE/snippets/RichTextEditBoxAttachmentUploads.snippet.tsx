import { FluentThemeProvider } from '@azure/communication-react';
import React from 'react';
import { ChatMessageComponentAsRichTextEditBox } from '@internal/react-components';

export const RichTextEditBoxAttachmentUploadsExample: () => JSX.Element = () => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <ChatMessageComponentAsRichTextEditBox
          onSubmit={async (message) => {
            timeoutRef.current = setTimeout(() => {
              alert(`sent message: ${message} `);
            }, delayForSendButton);
          }}
          message={{
            messageType: 'chat',
            content: 'Hi! How are you?',
            contentType: 'richtext/html',
            messageId: '1',
            createdOn: new Date()
          }}
          strings={{}}
        />
      </div>
    </FluentThemeProvider>
  );
};

// activeAttachmentUploads={[
//     {
//       id: '1',
//       name: 'Sample.pdf',
//       progress: 0.75
//     },
//     {
//       id: '2',
//       name: 'SampleXl.xlsx',
//       progress: 0.33
//     }
//   ]}
//   onSendMessage={async () => {
//     return;
//   }}

import { FluentThemeProvider } from '@azure/communication-react';
import React from 'react';
import {
  ChatMessageComponentAsRichTextEditBox,
  ChatMessageComponentAsRichTextEditBoxProps
} from '@internal/react-components';

export const RichTextEditBoxAttachmentUploadsExample: () => JSX.Element = () => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  const attachmentMetadata = [
    {
      id: '1',
      name: 'Sample.pdf',
      progress: 0.75
    },
    {
      id: '2',
      name: 'SampleXl.xlsx',
      progress: 0.33
    }
  ];

  const props: ChatMessageComponentAsRichTextEditBoxProps = {
    onSubmit: async (message, metadata, options) => {
      timeoutRef.current = setTimeout(() => {
        alert(`sent message: ${message} `);
      }, delayForSendButton);
    },
    message: {
      messageType: 'chat',
      content: 'Hi! How are you?',
      contentType: 'richtext/html',
      messageId: '1',
      createdOn: new Date(),
      attachments: attachmentMetadata
    },
    strings: {}
  };

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <ChatMessageComponentAsRichTextEditBox {...props} />
      </div>
    </FluentThemeProvider>
  );
};

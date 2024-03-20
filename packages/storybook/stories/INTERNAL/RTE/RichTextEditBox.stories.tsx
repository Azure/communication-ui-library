// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessageComponentAsRichTextEditBox } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

const RichTextEditBoxStory = (args): JSX.Element => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  return (
    <div style={{ width: '31.25rem', maxWidth: '90%' }}>
      <ChatMessageComponentAsRichTextEditBox
        onSubmit={async (message) => {
          timeoutRef.current = setTimeout(() => {
            alert(`sent message: ${message} `);
          }, delayForSendButton);
        }}
        message={{
          messageType: 'chat',
          content: args.message,
          contentType: 'richtext/html',
          messageId: '1',
          createdOn: new Date()
        }}
        strings={{}}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RichTextEditBox = RichTextEditBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-richtexteditbox`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/RichTextEditBox`,
  component: RichTextEditBoxStory,
  argTypes: {
    message: { control: 'text', defaultValue: 'Hi! How are you?' },
    strings: hiddenControl
  }
} as Meta;

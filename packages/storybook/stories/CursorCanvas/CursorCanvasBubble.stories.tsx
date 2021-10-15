// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CursorCanvasBubble as CursorCanvasBubbleComponent } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const colors = {
  '[self]': ['#EDEBE9', '#201F1E'],
  Orange: ['#CA5010', '#FFFFFF'],
  Green: ['#4EB4C2', '#FFFFFF'],
  Pink: ['#CF6196', '#FFFFFF']
};

const CursorCanvasBubbleStory = (args): JSX.Element => {
  const [text, setText] = useState<string | undefined>(undefined);

  return (
    <Stack>
      <CursorCanvasBubbleComponent
        bubbleOwnerName={args.name}
        backgroundColor={colors[args.backgroundColor][0]}
        color={colors[args.backgroundColor][1]}
        text={text}
        isEditing={args.isEditing}
        onTextFieldChange={function (text: string): void {
          setText(text);
        }}
        onTextFieldEnterPressed={function (): void {
          console.log('enter pressed');
        }}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CursorCanvasBubble = CursorCanvasBubbleStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-cursor-canvas-bubble`,
  title: `${COMPONENT_FOLDER_PREFIX}/Canvas/Cursor Canvas Bubble`,
  component: CursorCanvasBubbleComponent,
  argTypes: {
    name: { control: 'text', defaultValue: 'Mike Bublé', name: 'User name' },
    backgroundColor: { control: 'select', options: Object.keys(colors), defaultValue: '[self]' },
    isEditing: { control: 'boolean', defaultValue: true, name: 'Is Editing' }
  }
} as Meta;

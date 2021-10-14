// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CursorCanvasBubble as CursorCanvasBubbleComponent } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const CursorCanvasBubbleStory = (args): JSX.Element => {
  const [text, setText] = useState<string | undefined>(undefined);

  return (
    <Stack>
      <CursorCanvasBubbleComponent
        bubbleOwnerName={args.name}
        color={args.color}
        text={text}
        onEditingFinished={function (text: string): void {
          setText(text);
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
    color: { control: 'color', defaultValue: '#c0392b', name: 'Color' }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CursorCanvas as CursorCanvasComponent, CursorData, useTheme } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const throttleAmount = 5;
let throttleCounter = throttleAmount;

const CursorCanvasStory = (args): JSX.Element => {
  const [cursorState, setCursorState] = useState<CursorData[] | null>(null);
  const palette = useTheme().palette;

  return (
    <Stack
      onMouseMove={(ev) => {
        if (throttleCounter++ % throttleAmount !== 0) return;

        const mouseX = ev.clientX - ev.currentTarget.offsetLeft;
        const mouseY = ev.clientY - ev.currentTarget.offsetTop;

        if (!args.makeColorful) {
          setCursorState([
            {
              color: '#e74c3c',
              posX: mouseX,
              posY: mouseY
            }
          ]);
          return;
        }

        const radius = 60;
        const degressToRadians = Math.PI / 180;

        setCursorState([
          {
            color: '#2c3e50',
            posX: mouseX - radius * Math.cos(0),
            posY: mouseY - radius * Math.sin(0)
          },
          {
            color: '#1abc9c',
            posX: mouseX - radius * Math.cos(30 * degressToRadians),
            posY: mouseY - radius * Math.sin(30 * degressToRadians)
          },
          {
            color: '#2ecc71',
            posX: mouseX - radius * Math.cos(60 * degressToRadians),
            posY: mouseY - radius * Math.sin(60 * degressToRadians)
          },
          {
            color: '#9b59b6',
            posX: mouseX - radius * Math.cos(90 * degressToRadians),
            posY: mouseY - radius * Math.sin(90 * degressToRadians)
          },
          {
            color: '#f1c40f',
            posX: mouseX - radius * Math.cos(120 * degressToRadians),
            posY: mouseY - radius * Math.sin(120 * degressToRadians)
          },
          {
            color: '#e74c3c',
            posX: mouseX - radius * Math.cos(150 * degressToRadians),
            posY: mouseY - radius * Math.sin(150 * degressToRadians)
          }
        ]);
      }}
      horizontalAlign="center"
      verticalAlign="center"
      styles={{
        root: {
          width: '100vw',
          height: '100vh',
          background: palette.neutralLight
        }
      }}
    >
      <CursorCanvasComponent cursors={cursorState ? cursorState : []} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CursorCanvas = CursorCanvasStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-cursor-canvas`,
  title: `${COMPONENT_FOLDER_PREFIX}/Canvas/Cursor Canvas`,
  component: CursorCanvasComponent,
  argTypes: {
    makeColorful: { control: 'boolean', defaultValue: false, name: 'Make Colorful' }
  }
} as Meta;

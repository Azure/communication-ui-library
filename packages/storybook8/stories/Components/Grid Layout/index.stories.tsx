// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { GridLayout as GridLayoutComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { GridLayoutExample } from './snippets/GridLayout.snippet';
export { GridLayout } from './GridLayout.story';

export const GridLayoutExampleDocsOnly = {
  render: GridLayoutExample
};

const meta: Meta = {
  title: 'Components/Grid Layout',
  component: GridLayoutComponent,
  argTypes: {
    width: controlsToAdd.layoutWidth,
    height: controlsToAdd.layoutHeight,
    participants: controlsToAdd.gridParticipants,
    // Hiding auto-generated controls
    children: hiddenControl,
    layout: hiddenControl,
    styles: hiddenControl
  },
  args: {
    width: 600,
    height: 500,
    participants: [
      {
        displayName: 'Michael',
        isVideoReady: false
      },
      {
        displayName: 'Jim',
        isVideoReady: false
      },
      {
        displayName: 'Pam',
        isVideoReady: false
      },
      {
        displayName: 'Dwight',
        isVideoReady: false
      }
    ]
  }
};
export default meta;

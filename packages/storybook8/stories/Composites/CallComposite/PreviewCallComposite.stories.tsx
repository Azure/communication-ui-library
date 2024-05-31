// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
// eslint-disable-next-line no-restricted-imports
import { _MockCallAdapter } from '@internal/react-composites';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta<typeof CallCompositePreviewStory> = {
  title: 'Composites/CallComposite/Preview'
  // argTypes: {
  //   ...storyControls,
  //   // Hiding auto-generated controls
  //   ...defaultCallCompositeHiddenControls
  // }
};
export default meta;

const CallCompositePreviewStory = (): JSX.Element => {
  const adapter = new _MockCallAdapter({});

  return (
    <div style={{ height: '500px', maxHeight: '90vh' }}>
      <CallComposite adapter={adapter} />
    </div>
  );
};

type Story = StoryObj<typeof meta>;
export const Preview: Story = {
  render: CallCompositePreviewStory,
  name: 'Preview',
  parameters: {
    argTypes: {
      formFactor: { control: 'text' } // Always shows the control
    }
  }
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
// eslint-disable-next-line no-restricted-imports
import { _MockCallAdapter } from '@internal/react-composites';
import { Meta } from '@storybook/react';
import React from 'react';

const MockStory = (): JSX.Element => {
  const adapter = new _MockCallAdapter({});

  return (
    <div style={{ height: '500px', maxHeight: '90vh' }}>
      <CallComposite adapter={adapter} />
    </div>
  );
};

export const MockComposite = MockStory.bind({});

const meta: Meta<typeof MockStory> = {
  // id: `${COMPOSITE_FOLDER_PREFIX}-call-basicexample`,
  title: 'Composites/CallComposite/MockComposite'
  // component: CallComposite,
  // argTypes: {
  //   ...storyControls,
  //   // Hiding auto-generated controls
  //   ...defaultCallCompositeHiddenControls
  // }
};

export default meta;

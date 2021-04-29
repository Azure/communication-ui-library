// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { MicrophoneButton } from '@azure/communication-ui';
import { boolean } from '@storybook/addon-knobs';
import { getDocs } from './MicrophoneButtonDocs';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

export const MicrophoneButtonComponent = (): JSX.Element => {
  const toggleButtons = boolean('Toggle Buttons', false);
  const showLabels = boolean('Show Labels', false);

  return <MicrophoneButton showLabel={showLabels} checked={toggleButtons} />;
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/MicrophoneButton`,
  component: MicrophoneButton,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

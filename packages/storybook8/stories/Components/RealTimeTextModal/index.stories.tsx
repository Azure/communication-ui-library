// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RealTimeTextModal } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';
export { RealTimeTextModal } from './RealTimeTextModal.story';

const meta: Meta = {
  title: 'Components/Real Time Text Modal',
  component: RealTimeTextModal,
  argTypes: {
    showModal: hiddenControl,
    onDismissModal: hiddenControl,
    onStartRealTimeText: hiddenControl,
    strings: hiddenControl
  }
};

export default meta;

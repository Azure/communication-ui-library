// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RealTimeTextModal } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';
export { RealTimeTextModal } from './RealTimeTextModal.story';

const meta: Meta = {
  title: 'Components/Internal/Real Time Text Modal',
  component: RealTimeTextModal,
  argTypes: {
    showModal: hiddenControl,
    onDismissModal: hiddenControl,
    onStartRealTimeText: hiddenControl,
    strings: hiddenControl
  }
};

export default meta;

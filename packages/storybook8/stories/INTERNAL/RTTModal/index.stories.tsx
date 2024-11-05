// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RTTModal } from '@internal/react-components';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';
export { RTTModal } from './RTTModal.story';

const meta: Meta = {
  title: 'Components/Internal/RTT Modal',
  component: RTTModal,
  argTypes: {
    showModal: hiddenControl,
    onDismissModal: hiddenControl,
    onStartRTT: hiddenControl,
    strings: hiddenControl
  }
};

export default meta;

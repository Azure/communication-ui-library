// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { StartRealTimeTextButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { hiddenControl } from '../../controlsUtils';

export { StartRealTimeTextButton } from './StartRealTimeTextButton.story';

const meta: Meta = {
  title: 'Components/Start Real Time Text Button',
  component: StartRealTimeTextButton,
  argTypes: {
    onStartRealTimeText: hiddenControl,
    isRealTimeTextOn: hiddenControl,
    strings: hiddenControl,
    showLabel: hiddenControl,
    labelKey: hiddenControl,
    disableTooltip: hiddenControl,
    tooltipId: hiddenControl,
    onRenderOnIcon: hiddenControl,
    onRenderOffIcon: hiddenControl,
    styles: hiddenControl
  }
};

export default meta;

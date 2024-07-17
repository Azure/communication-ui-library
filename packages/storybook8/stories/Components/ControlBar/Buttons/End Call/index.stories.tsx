// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { EndCallButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../../controlsUtils';
import { EndCallButtonCustomExample } from './snippets/Custom.snippet';
import { EndCallButtonDefaultExample } from './snippets/Default.snippet';
import { EndCallButtonWithLabelExample } from './snippets/WithLabel.snippet';

export { EndCall } from './EndCall.story';

export const EndCallButtonCustomExampleDocsOnly = {
  render: EndCallButtonCustomExample
};

export const EndCallButtonDefaultExampleDocsOnly = {
  render: EndCallButtonDefaultExample
};

export const EndCallButtonWithLabelExampleDocsOnly = {
  render: EndCallButtonWithLabelExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Buttons/End Call',
  component: EndCallButton,
  argTypes: {
    showLabel: controlsToAdd.showLabel,
    // Hiding auto-generated controls
    onHangUp: hiddenControl,
    strings: hiddenControl,
    labelKey: hiddenControl,
    disableTooltip: hiddenControl,
    tooltipId: hiddenControl,
    onRenderOnIcon: hiddenControl,
    onRenderOffIcon: hiddenControl,
    styles: hiddenControl,
    enableEndCallMenu: hiddenControl
  },
  args: {
    showLabel: false
  }
};
export default meta;

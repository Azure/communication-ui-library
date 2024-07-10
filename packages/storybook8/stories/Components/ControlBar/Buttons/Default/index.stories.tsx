// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ControlBarButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../../controlsUtils';
import { CustomControlBarButtonExample } from './snippets/Custom.snippet';
import { ControlBarButtonExample } from './snippets/Default.snippet';
import { ControlBarButtonWithLabelExample } from './snippets/WithLabel.snippet';

export { Default } from './Default.story';

export const CustomControlBarButtonExampleDocsOnly = {
  render: CustomControlBarButtonExample
};

export const ControlBarButtonExampleDocsOnly = {
  render: ControlBarButtonExample
};

export const ControlBarButtonWithLabelExampleDocsOnly = {
  render: ControlBarButtonWithLabelExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Buttons/Default',
  component: ControlBarButton,
  argTypes: {
    showLabel: controlsToAdd.showLabel,
    icons: controlsToAdd.controlBarDefaultIcons,
    // Hiding auto-generated controls
    labelKey: hiddenControl,
    strings: hiddenControl,
    onRenderOnIcon: hiddenControl,
    onRenderOffIcon: hiddenControl,
    tooltipId: hiddenControl,
    styles: hiddenControl,
    disableTooltip: hiddenControl
  },
  args: {
    showLabel: false,
    icons: 'airplane'
  }
};
export default meta;

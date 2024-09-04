// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ScreenShareButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../../controlsUtils';
import { CustomScreenShareButtonExample } from './snippets/Custom.snippet';
import { ScreenShareButtonExample } from './snippets/Default.snippet';
import { ScreenShareButtonWithLabelExample } from './snippets/WithLabel.snippet';

export { ScreenShare } from './ScreenShare.story';

export const ScreenShareButtonExampleDocsOnly = {
  render: ScreenShareButtonExample
};

export const ScreenShareButtonWithLabelExampleDocsOnly = {
  render: ScreenShareButtonWithLabelExample
};

export const CustomScreenShareButtonExampleDocsOnly = {
  render: CustomScreenShareButtonExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Buttons/Screen Share',
  component: ScreenShareButton,
  argTypes: {
    checked: controlsToAdd.checked,
    showLabel: controlsToAdd.showLabel,
    // Hiding auto-generated controls
    onToggleScreenShare: hiddenControl,
    strings: hiddenControl,
    labelKey: hiddenControl,
    disableTooltip: hiddenControl,
    tooltipId: hiddenControl,
    onRenderOnIcon: hiddenControl,
    onRenderOffIcon: hiddenControl,
    styles: hiddenControl
  },
  args: {
    showLabel: false,
    checked: false
  }
};
export default meta;

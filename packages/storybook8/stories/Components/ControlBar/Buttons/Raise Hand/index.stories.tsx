// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { RaiseHandButton } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../../../controlsUtils';
import { CustomRaiseHandButtonExample } from './snippets/Custom.snippet';
import { RaiseHandButtonExample } from './snippets/Default.snippet';
import { RaiseHandButtonWithLabelExample } from './snippets/WithLabel.snippet';

export { RaiseHand } from './RaiseHand.story';

export const RaiseHandButtonExampleDocsOnly = {
  render: RaiseHandButtonExample
};

export const RaiseHandButtonWithLabelExampleDocsOnly = {
  render: RaiseHandButtonWithLabelExample
};

export const CustomRaiseHandButtonExampleDocsOnly = {
  render: CustomRaiseHandButtonExample
};

const meta: Meta = {
  title: 'Components/ControlBar/Buttons/Raise Hand',
  component: RaiseHandButton,
  argTypes: {
    checked: controlsToAdd.checked,
    showLabel: controlsToAdd.showLabel,
    // Hiding auto-generated controls
    onToggleRaiseHand: hiddenControl,
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

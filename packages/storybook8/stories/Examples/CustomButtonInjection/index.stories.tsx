// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { CustomButtonInjection as CustomButtonInjectionComponent } from './snippets/CustomButtonInjectionTypes';
import { CustomButtonWithAsyncStateExample } from './snippets/CustomButtonWithAsyncState.snippet';
import { CustomButtonWithStateExample } from './snippets/CustomButtonWithState.snippet';
import { LegacyControlBarCustomButtonInjectionExample } from './snippets/LegacyControlBarCustomButtonInjection.snippet';
import { MobileCustomButtonInjectionExample } from './snippets/MobileCustomButtonInjection.snippet';
import { OverflowCustomButtonInjectionExample } from './snippets/OverflowCustomButtonInjection.snippet';
import { PrimaryCustomButtonInjectionExample } from './snippets/PrimaryCustomButtonInjection.snippet';
import { SecondaryCustomButtonInjectionExample } from './snippets/SecondaryCustomButtonInjection.snippet';

export { CustomButtonInjection } from './CustomButtonInjection.story';

export const CustomButtonWithAsyncStateDocsOnly = {
  render: CustomButtonWithAsyncStateExample
};

export const CustomButtonWithStateDocsOnly = {
  render: CustomButtonWithStateExample
};

export const LegacyControlBarCustomButtonInjectionDocsOnly = {
  render: LegacyControlBarCustomButtonInjectionExample
};

export const MobileCustomButtonInjectionDocsOnly = {
  render: MobileCustomButtonInjectionExample
};

export const OverflowCustomButtonInjectionDocsOnly = {
  render: OverflowCustomButtonInjectionExample
};

export const PrimaryCustomButtonInjectionDocsOnly = {
  render: PrimaryCustomButtonInjectionExample
};

export const SecondaryCustomButtonInjectionDocsOnly = {
  render: SecondaryCustomButtonInjectionExample
};

const meta: Meta = {
  title: 'Examples/Custom Button Injection',
  component: CustomButtonInjectionComponent,
  argTypes: {
    formFactor: controlsToAdd.formFactor,
    placement: controlsToAdd.customButtonInjectionControls.placement,
    showButtonLabel: controlsToAdd.customButtonInjectionControls.showLabel,
    label: controlsToAdd.customButtonInjectionControls.label,
    icon: controlsToAdd.customButtonInjectionControls.icon,
    injectMaximumNumberOfButtons: controlsToAdd.customButtonInjectionControls.injectMaximumNumberOfButtons,
    disabled: controlsToAdd.customButtonInjectionControls.disabled,
    // Storybook object parsing is causing function consts to convert to string. This causes them to be null and not usable
    // Need to resolve this issue before enabling these args
    // allowRawObjectInput: controlsToAdd.customButtonInjectionControls.allowRawObjectInput,
    // options: controlsToAdd.customButtonInjectionControls.objectOptions,

    // Hiding auto-generated controls
    strings: hiddenControl,
    onItemClick: hiddenControl,
    text: hiddenControl,
    showLabel: hiddenControl,
    iconName: hiddenControl,
    ariaDescription: hiddenControl,
    key: hiddenControl,
    ariaLabel: hiddenControl,
    id: hiddenControl,
    participantState: hiddenControl,
    userId: hiddenControl,
    noVideoAvailableAriaLabel: hiddenControl,
    children: hiddenControl,
    styles: hiddenControl,
    renderElement: hiddenControl,
    onRenderPlaceholder: hiddenControl,
    initialsName: hiddenControl
  },
  args: {
    formFactor: controlsToAdd.formFactor.defaultValue,
    placement: controlsToAdd.customButtonInjectionControls.placement.defaultValue,
    showButtonLabel: controlsToAdd.customButtonInjectionControls.showLabel.defaultValue,
    label: controlsToAdd.customButtonInjectionControls.label.defaultValue,
    icon: controlsToAdd.customButtonInjectionControls.icon.defaultValue,
    injectMaximumNumberOfButtons: controlsToAdd.customButtonInjectionControls.injectMaximumNumberOfButtons.defaultValue,
    disabled: controlsToAdd.customButtonInjectionControls.disabled.defaultValue
    // Storybook object parsing is causing function consts to convert to string. This causes them to be null and not usable
    // Need to resolve this issue before enabling these args
    // allowRawObjectInput: controlsToAdd.customButtonInjectionControls.allowRawObjectInput.defaultValue,
    // options: controlsToAdd.customButtonInjectionControls.objectOptions.defaultValue
  }
} as Meta;

export default meta;

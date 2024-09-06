// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite, CustomCallControlButtonCallback } from '@azure/communication-react';
// eslint-disable-next-line no-restricted-imports
import { _MockCallAdapter } from '@internal/react-composites';
import { Description, Heading, Props, Title, Subheading, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { CONCEPTS_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { CustomButtonInjection as CustomButtonInjectionComponent, addCSS } from './snippets/CustomButtonInjectionTypes';
import { CustomButtonWithAsyncStateExample } from './snippets/CustomButtonWithAsyncState.snippet';
import { CustomButtonWithStateExample } from './snippets/CustomButtonWithState.snippet';
import { LegacyControlBarCustomButtonInjectionExample } from './snippets/LegacyControlBarCustomButtonInjection.snippet';
import { MobileCustomButtonInjectionExample } from './snippets/MobileCustomButtonInjection.snippet';
import { OverflowCustomButtonInjectionExample } from './snippets/OverflowCustomButtonInjection.snippet';
import { PrimaryCustomButtonInjectionExample } from './snippets/PrimaryCustomButtonInjection.snippet';
import { SecondaryCustomButtonInjectionExample } from './snippets/SecondaryCustomButtonInjection.snippet';

const CustomButtonWithAsyncStateExampleText =
  require('!!raw-loader!./snippets/CustomButtonWithAsyncStateText.snippet').default;
const CustomButtonWithStateExampleText = require('!!raw-loader!./snippets/CustomButtonWithStateText.snippet').default;
const LegacyControlBarCustomButtonInjectionExampleText =
  require('!!raw-loader!./snippets/LegacyControlBarCustomButtonInjectionText.snippet').default;
const MobileCustomButtonInjectionExampleText =
  require('!!raw-loader!./snippets/MobileCustomButtonInjectionText.snippet').default;
const OverflowCustomButtonInjectionExampleText =
  require('!!raw-loader!./snippets/OverflowCustomButtonInjectionText.snippet').default;
const PrimaryCustomButtonInjectionExampleText =
  require('!!raw-loader!./snippets/PrimaryCustomButtonInjectionText.snippet').default;
const SecondaryCustomButtonInjectionExampleText =
  require('!!raw-loader!./snippets/SecondaryCustomButtonInjectionText.snippet').default;

const getDocs: () => JSX.Element = () => {
  addCSS('#custom-button-injection-story button[aria-label="Custom"]{ border: 1px solid green; }');

  return (
    <div id="custom-button-injection-story">
      <Title>Custom Button Injection</Title>
      <Description>
        Custom Button Injection in our Composite experiences allows users to add their own functional buttons. Providing
        options to build out their own custom experiences like components, we want to make sure injecting customer's own
        features is simple and achievable.
      </Description>

      <Heading>Example</Heading>
      <Description>
        There are multiple areas, `primary`, `secondary`, and `overflow`, that you can inject buttons into. Depending on
        which area, only a max number of custom injected buttons will be displayed. This also varies if you are mobile
        or desktop.
      </Description>
      <Description>
        In all the examples below we use a mock adapter to quickly showcase custom button injection in our Call
        Composite. Please ensure you replace the mock adapter with your own adapter.
      </Description>
      <Subheading>Desktop: Primary Main Bar</Subheading>
      <Description>Max number of buttons: '3'</Description>
      <Canvas mdxSource={PrimaryCustomButtonInjectionExampleText}>
        <PrimaryCustomButtonInjectionExample />
      </Canvas>

      <Subheading>Desktop: Secondary Main Bar</Subheading>
      <Description>Max number of buttons: '2'</Description>
      <Canvas mdxSource={SecondaryCustomButtonInjectionExampleText}>
        <SecondaryCustomButtonInjectionExample />
      </Canvas>

      <Subheading>Desktop: Overflow More Button</Subheading>
      <Description>Max number of buttons: '∞'</Description>
      <Canvas mdxSource={OverflowCustomButtonInjectionExampleText}>
        <OverflowCustomButtonInjectionExample />
      </Canvas>

      <Subheading>Mobile: Primary and Overflow Contextual Menu</Subheading>
      <Description>Max number of buttons in primary: '1' Max number of buttons in Contextual Menu: '∞'</Description>
      <Canvas mdxSource={MobileCustomButtonInjectionExampleText}>
        <MobileCustomButtonInjectionExample />
      </Canvas>

      <Subheading>Custom Button With State</Subheading>
      <Canvas mdxSource={CustomButtonWithStateExampleText}>
        <CustomButtonWithStateExample />
      </Canvas>

      <Subheading>Custom Button With Async loading State</Subheading>
      <Canvas mdxSource={CustomButtonWithAsyncStateExampleText}>
        <CustomButtonWithAsyncStateExample />
      </Canvas>

      {/* <Heading>Code Samples</Heading> */}
      <Subheading>Legacy Control Bar Custom Button Injection</Subheading>
      <Canvas mdxSource={LegacyControlBarCustomButtonInjectionExampleText}>
        <LegacyControlBarCustomButtonInjectionExample />
      </Canvas>
      <Heading>Props</Heading>
      <Props of={CustomButtonInjectionComponent} />
    </div>
  );
};

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'primary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom',
      tooltipContent: 'Custom'
    },
    showLabel: tempShowLabel,
    disabled: tempDisabled
  }),
  () => ({
    placement: 'primary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom',
      tooltipContent: 'Custom'
    },
    showLabel: tempShowLabel,
    disabled: tempDisabled
  }),
  () => ({
    placement: 'primary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom',
      tooltipContent: 'Custom'
    },
    showLabel: tempShowLabel,
    disabled: tempDisabled
  }),
  () => ({
    placement: 'secondary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom',
      tooltipContent: 'Custom'
    },
    showLabel: tempShowLabel,
    disabled: tempDisabled
  }),
  () => ({
    placement: 'secondary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom',
      tooltipContent: 'Custom'
    },
    showLabel: tempShowLabel,
    disabled: tempDisabled
  }),
  () => ({
    placement: 'overflow',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom',
      tooltipContent: 'Custom'
    },
    disabled: tempDisabled
  })
];

let tempShowLabel = undefined;
let tempDisabled = false;

const CustomButtonInjectionStory = (args): JSX.Element => {
  const adapter = new _MockCallAdapter({});
  tempShowLabel = args.showButtonLabel !== 'undefined' ? args.showButtonLabel : undefined;
  tempDisabled = args.disabled;

  // boiler plate inject custom button here:
  const customButtonArray = [
    () => ({
      placement: args.placement,
      iconName: args.icon ?? 'DefaultCustomButton',
      strings: {
        label: args.label
      },
      showLabel: tempShowLabel,
      disabled: args.disabled
    })
  ];

  return (
    <CallComposite
      adapter={adapter}
      formFactor={args.formFactor}
      options={{
        callControls: {
          raiseHandButton: false,
          screenShareButton: false,
          peopleButton: false,
          onFetchCustomButtonProps: args.allowRawObjectInput
            ? args.options
            : args.injectMaximumNumberOfButtons
              ? maxCustomButtonsForInjection
              : customButtonArray
        }
      }}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const CustomButtonInjection = CustomButtonInjectionStory.bind({});

export default {
  id: `${CONCEPTS_FOLDER_PREFIX}-custom-button-injection`,
  title: `${CONCEPTS_FOLDER_PREFIX}/CustomButtonInjection`,
  component: CustomButtonInjectionComponent,
  argTypes: {
    formFactor: controlsToAdd.formFactor,
    placement: controlsToAdd.customButtonInjectionControls.placement,
    showButtonLabel: controlsToAdd.customButtonInjectionControls.showLabel,
    label: controlsToAdd.customButtonInjectionControls.label,
    icon: controlsToAdd.customButtonInjectionControls.icon,
    injectMaximumNumberOfButtons: controlsToAdd.customButtonInjectionControls.injectMaximumNumberOfButtons,
    allowRawObjectInput: controlsToAdd.customButtonInjectionControls.allowRawObjectInput,
    options: controlsToAdd.customButtonInjectionControls.objectOptions,
    disabled: controlsToAdd.customButtonInjectionControls.disabled,

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
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

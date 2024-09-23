// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { CallComposite, CustomCallControlButtonCallback } from '@azure/communication-react';
import { _MockCallAdapter } from '@internal/react-composites';
import React from 'react';

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

let tempShowLabel: boolean;
let tempDisabled = false;

const CustomButtonInjectionStory = (args: any): JSX.Element => {
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
    <div style={{ width: '100wh', height: '100vh' }}>
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
    </div>
  );
};

export const CustomButtonInjection = CustomButtonInjectionStory.bind({});

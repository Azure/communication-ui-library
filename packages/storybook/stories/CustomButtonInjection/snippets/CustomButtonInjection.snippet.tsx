import { CallComposite, CustomCallControlButtonCallback } from '@azure/communication-react';
// eslint-disable-next-line no-restricted-imports
import { _MockCallAdapter } from '@internal/react-composites';
import React from 'react';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'primary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    },
    disabled: false,
    showLabel: true
  }),
  () => ({
    placement: 'secondary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    },
    disabled: false,
    showLabel: true
  }),
  () => ({
    placement: 'overflow',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    },
    disabled: false,
    showLabel: true
  })
];

export const CustomButtonInjectionExample = (): JSX.Element => {
  // Replace mock adapter with an Azure Communication Call Adapter
  // Refer to CallComposite Basic Example
  const adapter = new _MockCallAdapter({});
  return (
    <CallComposite
      adapter={adapter}
      options={{
        callControls: {
          raiseHandButton: false,
          screenShareButton: false,
          onFetchCustomButtonProps: maxCustomButtonsForInjection
        }
      }}
    />
  );
};

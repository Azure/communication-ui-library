import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React from 'react';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn1'
    },
    disabled: false,
    showLabel: true,
    onItemClick: () => {}
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn2'
    },
    disabled: false,
    showLabel: true,
    onItemClick: () => {}
  }),
  () => ({
    placement: 'overflow',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn3'
    },
    disabled: false,
    showLabel: true,
    onItemClick: () => {}
  })
];

export const CustomButtonInjectionExample = (): JSX.Element => {
  // Replace mock adapter with an Azure Communication Call Adapter
  // Refer to CallComposite Basic Example
  const adapter = new MockCallAdapter({});
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

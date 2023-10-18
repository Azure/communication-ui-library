import { CallComposite, CustomCallControlButtonCallback, _MockCallAdapter } from '@azure/communication-react';
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
    showLabel: true,
    onItemClick: () => {}
  }),
  () => ({
    placement: 'secondary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    },
    disabled: false,
    showLabel: true,
    onItemClick: () => {}
  }),
  () => ({
    placement: 'overflow',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    },
    disabled: false,
    showLabel: true,
    onItemClick: () => {}
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

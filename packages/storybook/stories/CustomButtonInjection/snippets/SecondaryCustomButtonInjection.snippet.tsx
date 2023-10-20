import { CallComposite, CustomCallControlButtonCallback } from '@azure/communication-react';
import React from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';
import { _MockCallAdapter } from '@internal/react-composites';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'secondary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    }
  }),
  () => ({
    placement: 'secondary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    }
  })
];

export const SecondaryCustomButtonInjectionExample = (): JSX.Element => {
  const adapter = new _MockCallAdapter({});

  return (
    <div style={compositeCanvasContainerStyles}>
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
    </div>
  );
};

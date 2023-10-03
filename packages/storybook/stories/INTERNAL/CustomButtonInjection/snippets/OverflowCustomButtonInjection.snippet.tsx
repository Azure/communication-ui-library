import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'overflow',
    iconName: 'MessageEdit',
    text: 'btn6',
    key: 'btn6',
    styles: {
      root: {
        borderColor: 'pink'
      }
    }
  })
];

export const OverflowCustomButtonInjectionExample = (): JSX.Element => {
  const adapter = new MockCallAdapter({});

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

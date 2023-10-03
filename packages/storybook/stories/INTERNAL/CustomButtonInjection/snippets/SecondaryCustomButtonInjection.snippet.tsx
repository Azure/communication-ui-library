import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'secondary',
    iconName: 'MessageEdit',
    text: 'btn4',
    key: 'btn4',
    styles: {
      root: {
        borderColor: 'blue'
      }
    }
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageEdit',
    text: 'btn5',
    key: 'btn5',
    styles: {
      root: {
        borderColor: 'blue'
      }
    }
  })
];

export const SecondaryCustomButtonInjectionExample = (): JSX.Element => {
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

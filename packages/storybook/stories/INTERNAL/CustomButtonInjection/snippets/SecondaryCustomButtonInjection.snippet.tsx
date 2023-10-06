import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'secondary',
    iconName: 'MessageEdit',
    text: 'btn1',
    key: 'btn1',
    styles: {
      root: {
        borderColor: 'green'
      }
    }
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageEdit',
    text: 'btn1',
    key: 'btn1',
    styles: {
      root: {
        borderColor: 'green'
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

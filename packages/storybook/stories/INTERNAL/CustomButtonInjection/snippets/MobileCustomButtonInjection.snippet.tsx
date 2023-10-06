import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React from 'react';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'primary',
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
    placement: 'primary',
    iconName: 'MessageEdit',
    text: 'btn2',
    key: 'btn2',
    styles: {
      root: {
        borderColor: 'green'
      }
    }
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    text: 'btn3',
    key: 'btn3',
    styles: {
      root: {
        borderColor: 'green'
      }
    }
  }),
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
  }),
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

export const MobileCustomButtonInjectionExample = (): JSX.Element => {
  const adapter = new MockCallAdapter({});

  return (
    <div style={{ aspectRatio: 9 / 16, height: '32rem', margin: 'auto' }}>
      <CallComposite
        adapter={adapter}
        formFactor={'mobile'}
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

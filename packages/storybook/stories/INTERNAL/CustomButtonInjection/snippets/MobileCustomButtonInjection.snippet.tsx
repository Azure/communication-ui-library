import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React from 'react';
import { addCSS } from './CustomButtonInjectionTypes';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn1'
    }
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn2'
    }
  }),
  () => ({
    placement: 'primary',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn3'
    }
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn4'
    }
  }),
  () => ({
    placement: 'secondary',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn5'
    }
  }),
  () => ({
    placement: 'overflow',
    iconName: 'MessageEdit',
    strings: {
      label: 'btn6'
    }
  })
];

export const MobileCustomButtonInjectionExample = (): JSX.Element => {
  const adapter = new MockCallAdapter({});

  addCSS('#mobileCustomButtonInjectionExample button[aria-label="btn1"]{ border: 1px solid green; }');
  addCSS(
    '#mobileCustomButtonInjectionExample button[data-ui-id="common-call-composite-more-button"]{ border: 1px solid green; border-left: 0px; }'
  );

  return (
    <div id="mobileCustomButtonInjectionExample">
      <div style={{ aspectRatio: 9 / 16, height: '40rem', margin: 'auto' }}>
        <CallComposite
          adapter={adapter}
          formFactor={'mobile'}
          options={{
            callControls: {
              // raiseHandButton: true,
              // screenShareButton: false,
              onFetchCustomButtonProps: maxCustomButtonsForInjection
            }
          }}
        />
      </div>
    </div>
  );
};

import { CallComposite, CustomCallControlButtonCallback } from '@azure/communication-react';
// eslint-disable-next-line no-restricted-imports
import { _MockCallAdapter } from '@internal/react-composites';
import React from 'react';
import { addCSS } from '../../../utils';

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  () => ({
    placement: 'primary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    }
  }),
  () => ({
    placement: 'primary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    }
  }),
  () => ({
    placement: 'primary',
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
  }),
  () => ({
    placement: 'secondary',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    }
  }),
  () => ({
    placement: 'overflow',
    iconName: 'DefaultCustomButton',
    strings: {
      label: 'Custom'
    }
  })
];

export const MobileCustomButtonInjectionExample = (): JSX.Element => {
  const adapter = new _MockCallAdapter({});

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
              onFetchCustomButtonProps: maxCustomButtonsForInjection
            }
          }}
        />
      </div>
    </div>
  );
};

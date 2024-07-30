import { CallComposite, CustomCallControlButtonCallback } from '@azure/communication-react';
// eslint-disable-next-line no-restricted-imports
import { _MockCallAdapter } from '@internal/react-composites';
import React from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';
import { addCSS } from '../../../utils';

const generatePlaceHolderButton = (name: string): CustomCallControlButtonCallback => {
  return () => ({
    placement: 'overflow',
    iconName: 'DefaultCustomButton',
    strings: {
      label: name
    }
  });
};

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  generatePlaceHolderButton('Custom'),
  generatePlaceHolderButton('Custom'),
  generatePlaceHolderButton('Custom'),
  generatePlaceHolderButton('Custom'),
  generatePlaceHolderButton('Custom'),
  generatePlaceHolderButton('Custom')
];

export const OverflowCustomButtonInjectionExample = (): JSX.Element => {
  const adapter = new _MockCallAdapter({});

  addCSS(
    '#overflowCustomButtonInjectionExample button[data-ui-id="common-call-composite-more-button"]{ border-color:green; }'
  );

  return (
    <div style={compositeCanvasContainerStyles} id="overflowCustomButtonInjectionExample">
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

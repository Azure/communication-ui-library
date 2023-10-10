import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React from 'react';
import { addCSS, compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';

const generatePlaceHolderButton = (name: string): CustomCallControlButtonCallback => {
  return () => ({
    placement: 'overflow',
    iconName: 'MessageEdit',
    text: name,
    key: name
  });
};

//boiler plate for testing
const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
  generatePlaceHolderButton('btn1'),
  generatePlaceHolderButton('btn2'),
  generatePlaceHolderButton('btn3'),
  generatePlaceHolderButton('btn4'),
  generatePlaceHolderButton('btn5'),
  generatePlaceHolderButton('btn6')
];

export const OverflowCustomButtonInjectionExample = (): JSX.Element => {
  const adapter = new MockCallAdapter({});

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

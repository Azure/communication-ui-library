import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';

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
const addCSS = (css) => (document.head.appendChild(document.createElement('style')).innerHTML = css);

export const OverflowCustomButtonInjectionExample = (): JSX.Element => {
  const adapter = new MockCallAdapter({});

  addCSS('#test1 button[data-ui-id="common-call-composite-more-button"]{ border-color:green; }');

  return (
    <div style={compositeCanvasContainerStyles} id="test1">
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

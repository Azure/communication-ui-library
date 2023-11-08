import { CallComposite, CustomCallControlButtonCallback } from '@azure/communication-react';
// eslint-disable-next-line no-restricted-imports
import { _MockCallAdapter } from '@internal/react-composites';
import React, { useState } from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';

/**
 * A simple async function for testing async and await callbacks with custom buttons
 * @param stallTime number in milliseconds, default is 2000ms.
 */
const simpleAsyncCall = async (stallTime = 2000): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, stallTime));
};

export const CustomButtonWithAsyncStateExample = (): JSX.Element => {
  const adapter = new _MockCallAdapter({});
  const [clickSuccessful, setClickSuccessful] = useState(false);
  const [disabledCheck, setDisabledCheck] = useState(false);

  //boiler plate for testing
  const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
    () => ({
      placement: 'primary',
      iconName: !clickSuccessful ? 'DefaultCustomButton' : 'NetworkReconnectIcon',
      strings: {
        label: 'Async Custom',
        ariaLabel: 'Custom'
      },
      onItemClick: () => {
        setDisabledCheck(true);
        try {
          simpleAsyncCall().then(() => {
            setDisabledCheck(false);
            setClickSuccessful(!clickSuccessful);
          });
        } catch {
          setDisabledCheck(false);
        }
      },
      disabled: disabledCheck
    })
  ];

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

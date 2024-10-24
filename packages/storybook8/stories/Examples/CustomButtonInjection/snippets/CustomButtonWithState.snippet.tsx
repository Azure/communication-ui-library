import { CallComposite, CustomCallControlButtonCallback } from '@azure/communication-react';
// eslint-disable-next-line no-restricted-imports
import { _MockCallAdapter } from '@internal/react-composites';
import React, { useState } from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';

export const CustomButtonWithStateExample = (): JSX.Element => {
  const adapter = new _MockCallAdapter({});
  const [clickSuccessful, setClickSuccessful] = useState(false);

  //boiler plate for testing
  const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
    () => ({
      placement: 'primary',
      iconName: !clickSuccessful ? 'DefaultCustomButton' : 'NetworkReconnectIcon',
      strings: {
        label: 'Custom'
      },
      onItemClick: () => {
        setClickSuccessful(!clickSuccessful);
      }
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

import { CallComposite, CustomCallControlButtonCallback, MockCallAdapter } from '@azure/communication-react';
import React, { useState } from 'react';
import { compositeCanvasContainerStyles } from './CustomButtonInjectionTypes';

export const CustomButtonWithStateExample = (): JSX.Element => {
  const adapter = new MockCallAdapter({});
  const [clickSuccessful, setClickSuccessful] = useState(false);

  //boiler plate for testing
  const maxCustomButtonsForInjection: CustomCallControlButtonCallback[] = [
    () => ({
      placement: 'primary',
      iconName: !clickSuccessful ? 'MessageEdit' : 'NetworkReconnectIcon',
      text: 'btn1',
      key: 'btn1',
      styles: {
        root: {
          borderColor: 'green'
        }
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

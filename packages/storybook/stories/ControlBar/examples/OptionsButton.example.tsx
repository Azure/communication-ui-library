import React from 'react';
import { FluentThemeProvider, ControlBar, optionsButtonProps, videoButtonProps } from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';

export const OptionsButtonExample: () => JSX.Element = () => {
  const exampleOptionsMenuProps = {
    items: [
      {
        key: '1',
        name: 'Choose Camera',
        iconProps: { iconName: 'LocationCircle' },
        subMenuProps: {
          items: [
            { key: 'camera1', text: 'Full HD Webcam', title: 'Full HD Webcam', canCheck: true, isChecked: true },
            { key: 'camera2', text: 'Macbook Pro Webcam', title: 'Macbook Pro Webcam' }
          ]
        }
      },
      {
        key: '2',
        name: 'Choose Microphone',
        iconProps: { iconName: 'LocationCircle' },
        subMenuProps: {
          items: [
            { key: 'mic1', text: 'Realtek HD Audio', title: 'Realtek HD Audio' },
            { key: 'mic2', text: 'Macbook Pro Mic', title: 'Macbook Pro Mic', canCheck: true, isChecked: true }
          ]
        }
      }
    ]
  };
  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <DefaultButton
          {...videoButtonProps}
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <DefaultButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
      </ControlBar>
    </FluentThemeProvider>
  );
};

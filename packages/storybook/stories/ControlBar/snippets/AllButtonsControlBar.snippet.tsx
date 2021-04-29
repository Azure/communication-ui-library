import React from 'react';
import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  answerButtonProps,
  hangupButtonProps,
  optionsButtonProps,
  recordButtonProps,
  screenShareButtonProps
} from '@azure/communication-ui';
import { DefaultButton, IContextualMenuProps } from '@fluentui/react';

export const AllButtonsControlBarExample: () => JSX.Element = () => {
  const exampleOptionsMenuProps: IContextualMenuProps = {
    items: [
      {
        key: '1',
        name: 'Choose Camera',
        iconProps: { iconName: 'LocationCircle' },
        onClick: () => alert('Choose Camera Menu Item Clicked!')
      }
    ]
  };

  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <CameraButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <MicrophoneButton
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <DefaultButton
          {...screenShareButtonProps}
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <DefaultButton
          {...recordButtonProps}
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <DefaultButton
          {...answerButtonProps}
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <DefaultButton {...optionsButtonProps} menuProps={exampleOptionsMenuProps} />
        <DefaultButton
          {...hangupButtonProps}
          onClick={() => {
            /*handle onClick*/
          }}
        />
      </ControlBar>
    </FluentThemeProvider>
  );
};

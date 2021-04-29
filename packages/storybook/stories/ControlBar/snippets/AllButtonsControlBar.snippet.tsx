import React from 'react';
import {
  AudioButton,
  ControlBar,
  FluentThemeProvider,
  answerButtonProps,
  hangupButtonProps,
  optionsButtonProps,
  recordButtonProps,
  screenShareButtonProps,
  videoButtonProps
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
        <DefaultButton
          {...videoButtonProps}
          onClick={() => {
            /*handle onClick*/
          }}
        />
        <AudioButton
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

import React from 'react';
import {
  CameraButton,
  ControlBar,
  FluentThemeProvider,
  MicrophoneButton,
  hangupButtonProps
} from '@azure/communication-ui';
import { DefaultButton, concatStyleSets } from '@fluentui/react';
import { CallEndIcon } from '@fluentui/react-northstar';

export const CustomButtonsExample: () => JSX.Element = () => {
  const CustomHangupButton: () => JSX.Element = () => {
    const styles = concatStyleSets(hangupButtonProps.styles, {
      root: {
        height: 'inherit',
        background: 'crimson',
        color: 'white',
        width: '10rem'
      },
      rootHovered: {
        background: 'darkred',
        color: 'white'
      },
      flexContainer: { flexFlow: 'row' }
    });

    return (
      <DefaultButton
        onRenderIcon={() => <CallEndIcon key={'hangupBtnIconKey'} />}
        onRenderText={() => (
          <span key={'hangupBtnTextKey'} style={{ marginLeft: '0.5rem' }}>
            End Call
          </span>
        )}
        styles={styles}
        onClick={() => {
          /* handle hangup */
        }}
      />
    );
  };

  return (
    <FluentThemeProvider>
      <ControlBar layout={'horizontal'}>
        <CameraButton />
        <MicrophoneButton />
        <CustomHangupButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};

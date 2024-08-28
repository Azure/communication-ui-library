import {
  CameraButton,
  ControlBar,
  EndCallButton,
  FluentThemeProvider,
  MicrophoneButton
} from '@azure/communication-react';
import { CallEnd20Filled } from '@fluentui/react-icons';
import React from 'react';

export const CustomButtonsExample: () => JSX.Element = () => {
  const CustomEndCallButton: () => JSX.Element = () => {
    const customStyles = {
      root: {
        height: 'inherit',
        background: 'darkorange',
        color: 'white',
        width: '10rem'
      },
      rootHovered: {
        background: 'darkred',
        color: 'white'
      },
      flexContainer: { flexFlow: 'row' }
    };

    return (
      <EndCallButton
        styles={customStyles}
        showLabel={true}
        onRenderIcon={() => <CallEnd20Filled primaryFill="currentColor" key={'hangupBtnIconKey'} />}
        onRenderText={() => (
          <span key={'hangupBtnTextKey'} style={{ marginLeft: '0.5rem' }}>
            End Call
          </span>
        )}
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
        <CustomEndCallButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};

import React from 'react';
import {
  FluentThemeProvider,
  audioButtonProps,
  ControlBar,
  hangupButtonProps,
  videoButtonProps
} from '@azure/communication-ui';
import { DefaultButton, concatStyleSets } from '@fluentui/react';
import { CallEndIcon } from '@fluentui/react-northstar';

export const CustomControlBarExample: () => JSX.Element = () => {
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
        onRenderIcon={() => <CallEndIcon />}
        onRenderText={() => <span style={{ marginLeft: '0.250rem' }}>End Call</span>}
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
        <DefaultButton {...videoButtonProps} />
        <DefaultButton {...audioButtonProps} />
        <CustomHangupButton />
      </ControlBar>
    </FluentThemeProvider>
  );
};

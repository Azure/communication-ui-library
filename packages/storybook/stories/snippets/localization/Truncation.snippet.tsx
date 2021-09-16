import {
  CameraButton,
  ControlBar,
  EndCallButton,
  LocalizationProvider,
  MicrophoneButton,
  ScreenShareButton,
  COMPONENT_LOCALE_DE_DE
} from '@azure/communication-react';
import { IStyle } from '@fluentui/react';
import React from 'react';

export const TruncationSnippet = (): JSX.Element => {
  const buttonStyle = {
    root: { width: '4em', padding: '0' },
    label: {
      width: '2.75em',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      margin: '0 auto'
    } as IStyle
  };
  return (
    <LocalizationProvider locale={COMPONENT_LOCALE_DE_DE}>
      <ControlBar>
        <CameraButton showLabel={true} styles={buttonStyle} />
        <MicrophoneButton showLabel={true} styles={buttonStyle} />
        <ScreenShareButton showLabel={true} styles={buttonStyle} />
        <EndCallButton showLabel={true} styles={buttonStyle} />
      </ControlBar>
    </LocalizationProvider>
  );
};

import React from 'react';
import { MessageBar } from '@fluentui/react';

export interface BannerProps {
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
}

export const Banner = (props: BannerProps): JSX.Element => {
  // TODO: Make dismissable.
  return (
    <MessageBar styles={{ content: { alignItems: 'center' } }}>
      Recording is {props.recordingEnabled ? 'enabled' : 'disabled'}
      <br />
      Transcription is {props.transcriptionEnabled ? 'enabled' : 'disabled'}
    </MessageBar>
  );
};

import React from 'react';
import { MessageBar } from '@fluentui/react';
import { getPreviousElement } from '@fluentui/react-northstar';

export interface BannerProps {
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
}

interface State {
  previousRecordingEnabled: boolean;
  previousTranscriptionEnabled: boolean;
}

export class Banner extends React.Component<BannerProps, State> {
  constructor(props: BannerProps) {
    super(props);
    this.state = {
      previousRecordingEnabled: false,
      previousTranscriptionEnabled: false
    };
  }

  render(): JSX.Element {
    // TODO: Make dismissable.
    return (
      <MessageBar styles={{ content: { alignItems: 'center' } }}>
        Recording is {enabledOrNot(this.props.recordingEnabled)}, previously was{' '}
        {enabledOrNot(this.state.previousRecordingEnabled)}.
        <br />
        Transcription is {enabledOrNot(this.props.transcriptionEnabled)}, previously was{' '}
        {enabledOrNot(this.state.previousTranscriptionEnabled)}.
        <br />
      </MessageBar>
    );
  }
}

function enabledOrNot(b: boolean): string {
  return b ? 'enabled' : 'disabled';
}

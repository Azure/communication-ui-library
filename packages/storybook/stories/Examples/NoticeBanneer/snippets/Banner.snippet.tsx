import React from 'react';
import { MessageBar } from '@fluentui/react';

export interface BannerProps {
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
}

export class Banner extends React.Component<BannerProps> {
  constructor(props: BannerProps) {
    super(props);
  }

  render() {
    // TODO: Make dismissable.
    return (
      <MessageBar styles={{ content: { alignItems: 'center' } }}>
        Recording is {this.props.recordingEnabled ? 'enabled' : 'disabled'}
        <br />
        Transcription is {this.props.transcriptionEnabled ? 'enabled' : 'disabled'}
      </MessageBar>
    );
  }
}

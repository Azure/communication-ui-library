import React from 'react';
import { MessageBar } from '@fluentui/react';
export interface TeamsInterop {
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
}
export interface BannerProps {
  teamsInteropCurrent: TeamsInterop;
  teamsInteropPrevious: TeamsInterop;
}

export class Banner extends React.Component<BannerProps> {
  render(): JSX.Element {
    const cur = this.props.teamsInteropCurrent;
    const prev = this.props.teamsInteropPrevious;
    // TODO: Make dismissable.
    return (
      <MessageBar styles={{ content: { alignItems: 'center' } }}>
        Recording is {enabledOrNot(cur.recordingEnabled)}, previously was {enabledOrNot(prev.recordingEnabled)}.
        <br />
        Transcription is {enabledOrNot(cur.transcriptionEnabled)}, previously was{' '}
        {enabledOrNot(prev.transcriptionEnabled)}.
        <br />
      </MessageBar>
    );
  }
}

function enabledOrNot(b: boolean): string {
  return b ? 'enabled' : 'disabled';
}

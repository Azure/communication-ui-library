import React from 'react';
import { MessageBar } from '@fluentui/react';
import { TeamsState } from './TeamsState.snippet';

export interface BannerProps {
  teamsState: TeamsState;
}

interface State {
  currentProps: BannerProps;
  previousProps: BannerProps;
}

export class Banner extends React.Component<BannerProps, State> {
  render(): JSX.Element {
    const ts = this.props.teamsState;
    // TODO: Make dismissable.
    return (
      <MessageBar styles={{ content: { alignItems: 'center' } }}>
        Recording is {enabledOrNot(ts.recordingEnabled)}, previously was {enabledOrNot(ts.recordingPreviouslyEnabled)}.
        <br />
        Transcription is {enabledOrNot(ts.transcriptionEnabled)}, previously was{' '}
        {enabledOrNot(ts.transcriptionPreviouslyEnabled)}.
        <br />
      </MessageBar>
    );
  }
}

function enabledOrNot(b: boolean): string {
  return b ? 'enabled' : 'disabled';
}

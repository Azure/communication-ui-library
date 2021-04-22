import React from 'react';
import { MessageBar } from '@fluentui/react';

export interface BannerProps {
  recordingEnabled: boolean;
  transcriptionEnabled: boolean;
}

interface State {
  currentProps: BannerProps;
  previousProps: BannerProps;
}

export class Banner extends React.Component<BannerProps, State> {
  constructor(props: BannerProps) {
    super(props);
    this.state = {
      currentProps: {
        recordingEnabled: false,
        transcriptionEnabled: false
      },
      previousProps: {
        recordingEnabled: true,
        transcriptionEnabled: false
      }
    };
  }

  static getDerivedStateFromProps(props: BannerProps, state: State): State | null {
    return {
      currentProps: { ...props },
      previousProps: { ...state.currentProps }
    };
  }

  render(): JSX.Element {
    const cur = this.state.currentProps;
    const prev = this.state.previousProps;
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

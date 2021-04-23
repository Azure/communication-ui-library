import { button } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { CallComponent } from './snippets/CallComponent.snippet';
import { getDocs } from './Docs';
import { toggleRecording, toggleTranscription } from './snippets/TeamsState.snippet';

export const Component: () => JSX.Element = () => {
  // TODO: Fix dark theming
  // TODO: Avoid re-rendering video when recording/transcription is enabled/disabled.
  const [state, setState] = useState({
    recordingEnabled: false,
    recordingPreviouslyEnabled: false,
    transcriptionEnabled: false,
    transcriptionPreviouslyEnabled: false
  });
  button('Toggle Recording', () => {
    setState(toggleRecording(state));
    return false;
  });
  button('Toggle Transcription', () => {
    setState(toggleTranscription(state));
    return false;
  });

  return <CallComponent banner={{ teamsState: state }} />;
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/NoticeBanner`,
  component: Component,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

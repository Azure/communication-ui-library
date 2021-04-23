import { button } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { CallComponent } from './snippets/CallComponent.snippet';
import { getDocs } from './Docs';

export const Component: () => JSX.Element = () => {
  // TODO: Fix dark theming
  // TODO: Avoid re-rendering video when recording/transcription is enabled/disabled.

  const [recording, setRecording] = useState({
    current: false,
    previous: false
  });
  button('Toggle Recording', () => {
    setRecording(toggleWithHistory(recording));
    return false;
  });

  const [transcription, setTranscription] = useState({
    current: false,
    previous: false
  });
  button('Toggle Transcription', () => {
    setTranscription(toggleWithHistory(transcription));
    return false;
  });

  return (
    <CallComponent
      teamsInteropCurrent={{ recordingEnabled: recording.current, transcriptionEnabled: transcription.current }}
      teamsInteropPrevious={{ recordingEnabled: recording.previous, transcriptionEnabled: transcription.previous }}
    />
  );
};

interface ToggleState {
  current: boolean;
  previous: boolean;
}

function toggleWithHistory(s: ToggleState): ToggleState {
  return {
    current: !s.current,
    previous: s.current
  };
}

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/NoticeBanner`,
  component: Component,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

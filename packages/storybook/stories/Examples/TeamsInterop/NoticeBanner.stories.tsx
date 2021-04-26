import { button } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { CallComponent } from './snippets/CallComponent.snippet';
import { getDocs } from './Docs';

export const NoticeBanner: () => JSX.Element = () => {
  const [recording, setRecording] = useState({
    current: false,
    previous: false
  });
  const [transcription, setTranscription] = useState({
    current: false,
    previous: false
  });

  button('Toggle Recording', () => {
    setRecording(toggleWithHistory(recording));
    setTranscription(mirrorHistory(transcription));
    return false;
  });
  button('Toggle Transcription', () => {
    setRecording(mirrorHistory(recording));
    setTranscription(toggleWithHistory(transcription));
    return false;
  });

  // TODO: Fix dark theming.
  // Once https://github.com/Azure/communication-ui-sdk/pull/169 lands, same fix should be applied here.
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

function mirrorHistory(s: ToggleState): ToggleState {
  return {
    current: s.current,
    previous: s.current
  };
}

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/TeamsInterop`,
  component: NoticeBanner,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

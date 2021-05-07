import { button } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { getDocs } from './Docs';
import { CallComponent } from './snippets/CallComponent.snippet';

export const NoticeBanner: () => JSX.Element = () => {
  const [teamsInterop, setTeamsInterop] = useState({
    recordingEnabled: false,
    transcriptionEnabled: false
  });

  button('Toggle Recording', () => {
    setTeamsInterop({
      recordingEnabled: !teamsInterop.recordingEnabled,
      transcriptionEnabled: teamsInterop.transcriptionEnabled
    });
    // Without an explicit return, the Canvas iframe is re-rendered, and all Components are recreated.
    // This causes the state in this component to be lost.
    return false;
  });
  button('Toggle Transcription', () => {
    setTeamsInterop({
      recordingEnabled: teamsInterop.recordingEnabled,
      transcriptionEnabled: !teamsInterop.transcriptionEnabled
    });
    // Without an explicit return, the Canvas iframe is re-rendered, and all Components are recreated.
    // This causes the state in this component to be lost.
    return false;
  });

  // TODO: Fix dark theming.
  // Once https://github.com/Azure/communication-ui-sdk/pull/169 lands, same fix should be applied here.
  return <CallComponent {...teamsInterop} />;
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/TeamsInterop`,
  component: NoticeBanner,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

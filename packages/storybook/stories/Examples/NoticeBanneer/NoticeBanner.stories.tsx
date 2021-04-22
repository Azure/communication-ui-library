import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { CallComponent } from './snippets/CallComponent.snippet';
import { getDocs } from './Docs';

export const Component: () => JSX.Element = () => {
  const recordingEnabled = boolean('Record meeting', false);
  const transcriptionEnabled = boolean('Transcribe meeting', false);
  return <CallComponent banner={{ recordingEnabled: recordingEnabled, transcriptionEnabled: transcriptionEnabled }} />;
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

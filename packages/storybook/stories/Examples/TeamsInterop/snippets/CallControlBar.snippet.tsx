import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  labeledOptionsButtonProps
} from '@azure/react-components';
import { DefaultButton } from '@fluentui/react';
import React from 'react';

// TODO: Add unique keys to the list here.
export const CallControlBar = (): JSX.Element => {
  return (
    <ControlBar
      layout="dockedBottom"
      styles={{ root: { background: 'white', minHeight: '4.25rem', alignItems: 'center' } }}
    >
      <CameraButton showLabel={true} checked={true} />
      <MicrophoneButton showLabel={true} checked={true} />
      <DefaultButton {...labeledOptionsButtonProps} />
      <EndCallButton showLabel={true} style={{ borderRadius: '0.25rem', marginLeft: '0.25rem' }} />
    </ControlBar>
  );
};

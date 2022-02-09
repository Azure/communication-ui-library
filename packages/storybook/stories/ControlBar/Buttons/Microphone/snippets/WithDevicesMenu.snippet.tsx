import { MicrophoneButton, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const MicrophoneButtonWithDevicesMenuExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MicrophoneButton
        onClick={() => {
          /* onClick is needed to enable clicking on left half */
        }}
        enableDeviceSelectionMenu
        speakers={[
          { id: 'speaker1', name: 'Internal Speakers' },
          { id: 'speaker2', name: 'Headphones' }
        ]}
        selectedSpeaker={{ id: 'speaker2', name: 'Headphones' }}
        onSelectSpeaker={async () => {
          /* onSelectSpeaker is needed to enable opening the device menu */
        }}
        microphones={[{ id: 'microphone1', name: 'Internal Microphone' }]}
        selectedMicrophone={{ id: 'microphone1', name: 'Internal Microphone' }}
        onSelectMicrophone={async () => {
          /* onSelectMicrophone is needed to enable opening the device menu */
        }}
        styles={{
          splitButtonContainer: {
            // Add a border to better show the two halves of the button.
            border: '1px solid'
          }
        }}
      />
    </FluentThemeProvider>
  );
};

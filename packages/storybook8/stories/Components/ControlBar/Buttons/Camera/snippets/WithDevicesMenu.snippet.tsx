import { CameraButton, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const CameraButtonWithDevicesMenuExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <CameraButton
        enableDeviceSelectionMenu
        cameras={[
          { id: 'camera1', name: 'Front Camera' },
          { id: 'camera2', name: 'Back Camera' }
        ]}
        selectedCamera={{ id: 'camera1', name: 'Front Camera' }}
        onClick={() => {
          /* onClick is needed to enable clicking on left half */
        }}
        onSelectCamera={async () => {
          /* onSelectCamera is needed to enable opening the device menu */
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

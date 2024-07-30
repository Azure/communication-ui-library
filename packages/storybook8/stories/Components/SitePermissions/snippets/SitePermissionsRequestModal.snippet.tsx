// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CameraAndMicrophoneSitePermissions,
  CameraSitePermissions,
  DEFAULT_COMPONENT_ICONS,
  MicrophoneSitePermissions
} from '@azure/communication-react';
import { Modal, PrimaryButton, Stack, registerIcons } from '@fluentui/react';
import React, { useState } from 'react';

registerIcons({
  icons: DEFAULT_COMPONENT_ICONS
});

export const SitePermissionsRequestModal: () => JSX.Element = () => {
  const [microphoneCameraModalOpen, setMicrophoneCameraModalOpen] = useState<boolean>(false);
  const [microphoneModalOpen, setMicrophoneModalOpen] = useState<boolean>(false);
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);

  return (
    <Stack horizontal>
      <PrimaryButton
        style={{ margin: 'auto' }}
        onClick={() => {
          setMicrophoneCameraModalOpen(true);
        }}
      >
        Open Microphone and Camera permission modal
      </PrimaryButton>
      <PrimaryButton
        style={{ margin: 'auto' }}
        onClick={() => {
          setMicrophoneModalOpen(true);
        }}
      >
        Open Microphone permission modal
      </PrimaryButton>
      <PrimaryButton
        style={{ margin: 'auto' }}
        onClick={() => {
          setCameraModalOpen(true);
        }}
      >
        Open Camera permission modal
      </PrimaryButton>
      <Modal isOpen={microphoneCameraModalOpen} onDismiss={() => setMicrophoneCameraModalOpen(false)}>
        <CameraAndMicrophoneSitePermissions
          appName={'Storybook'}
          onTroubleshootingClick={() => {
            alert('clicked trouble shooting');
          }}
          kind={'request'}
        />
      </Modal>
      <Modal isOpen={microphoneModalOpen} onDismiss={() => setMicrophoneModalOpen(false)}>
        <MicrophoneSitePermissions
          appName={'Storybook'}
          onTroubleshootingClick={() => {
            alert('clicked trouble shooting');
          }}
          kind={'request'}
        />
      </Modal>
      <Modal isOpen={cameraModalOpen} onDismiss={() => setCameraModalOpen(false)}>
        <CameraSitePermissions
          appName={'Storybook'}
          onTroubleshootingClick={() => {
            alert('clicked trouble shooting');
          }}
          onContinueAnywayClick={() => {
            setCameraModalOpen(false);
          }}
          kind={'request'}
        />
      </Modal>
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton, Stack } from '@fluentui/react';
import {
  CameraAndMicrophoneSitePermissions,
  CameraSitePermissions,
  MicrophoneSitePermissions
} from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../react-components/src/localization';

export const SitePermissionsRequestModal: () => JSX.Element = () => {
  const [microphoneCameraModalOpen, setMicrophoneCameraModalOpen] = useState<boolean>(false);
  const [microphoneModalOpen, setMicrophoneModalOpen] = useState<boolean>(false);
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const micCameralocale = useLocale().strings.CameraAndMicrophoneSitePermissionsRequest;
  const cameraLocale = useLocale().strings.CameraSitePermissionsRequest;
  const microphoneLocale = useLocale().strings.MicrophoneSitePermissionsRequest;
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
          strings={micCameralocale}
          type={'request'}
        />
      </Modal>
      <Modal isOpen={microphoneModalOpen} onDismiss={() => setMicrophoneModalOpen(false)}>
        <MicrophoneSitePermissions
          appName={'Storybook'}
          onTroubleshootingClick={() => {
            alert('clicked trouble shooting');
          }}
          strings={microphoneLocale}
          type={'request'}
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
          strings={cameraLocale}
          type={'request'}
        />
      </Modal>
    </Stack>
  );
};

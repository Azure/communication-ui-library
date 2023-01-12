// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { UnsupportedBrowser, UnsupportedBrowserVersion, UnsupportedOperatingSystem } from '@azure/communication-react';
import { Modal, PrimaryButton, Stack } from '@fluentui/react';
import React, { useState } from 'react';

export const UnsupportedEnvironmentModals: () => JSX.Element = () => {
  const [unsupportedBrowserModalOpen, setUnsupportedBrowserModalOpen] = useState<boolean>(false);
  const [unsupportedBrowserVersionModalOpen, setUnsupportedBrowserVersionModalOpen] = useState<boolean>(false);
  const [unsupportedOperatingSystemModalOpen, setUnsupportedOperatingSystemModalOpen] = useState<boolean>(false);
  return (
    <Stack horizontal>
      <PrimaryButton
        style={{ margin: 'auto' }}
        onClick={() => {
          setUnsupportedBrowserModalOpen(true);
        }}
      >
        Open UnsupportedBrowser Modal
      </PrimaryButton>
      <PrimaryButton
        style={{ margin: 'auto' }}
        onClick={() => {
          setUnsupportedBrowserVersionModalOpen(true);
        }}
      >
        Open UnsupportedBrowserVersion Modal
      </PrimaryButton>
      <PrimaryButton
        style={{ margin: 'auto' }}
        onClick={() => {
          setUnsupportedOperatingSystemModalOpen(true);
        }}
      >
        Open UnsupportedOperatingSystem Modal
      </PrimaryButton>
      <Modal isOpen={unsupportedBrowserModalOpen} onDismiss={() => setUnsupportedBrowserModalOpen(false)}>
        <UnsupportedBrowser
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Modal>
      <Modal isOpen={unsupportedBrowserVersionModalOpen} onDismiss={() => setUnsupportedBrowserVersionModalOpen(false)}>
        <UnsupportedBrowserVersion
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
          onContinueAnywayClick={() => alert('clicked continue anyway')}
        />
      </Modal>
      <Modal
        isOpen={unsupportedOperatingSystemModalOpen}
        onDismiss={() => setUnsupportedOperatingSystemModalOpen(false)}
      >
        <UnsupportedOperatingSystem
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Modal>
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton, Stack } from '@fluentui/react';
import { UnsupportedBrowser, UnsupportedBrowserVersion } from '@internal/react-components';
import React, { useState } from 'react';

import { useLocale } from '../../../../../react-components/src/localization';

export const UnsupportedEnvironmentModals: () => JSX.Element = () => {
  const unsupportedBrowserStrings = useLocale().strings.UnsupportedBrowser;
  const unsupportedBrowserVersionStrings = useLocale().strings.UnsupportedBrowserVersion;
  const [unsupportedBrowserModalOpen, setUnsupportedBrowserModalOpen] = useState<boolean>(false);
  const [unsupportedBrowserVersionModalOpen, setUnsupportedBrowserVersionModalOpen] = useState<boolean>(false);
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
      <Modal isOpen={unsupportedBrowserModalOpen} onDismiss={() => setUnsupportedBrowserModalOpen(false)}>
        <UnsupportedBrowser
          strings={unsupportedBrowserStrings}
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Modal>
      <Modal isOpen={unsupportedBrowserVersionModalOpen} onDismiss={() => setUnsupportedBrowserVersionModalOpen(false)}>
        <UnsupportedBrowserVersion
          strings={unsupportedBrowserVersionStrings}
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Modal>
    </Stack>
  );
};

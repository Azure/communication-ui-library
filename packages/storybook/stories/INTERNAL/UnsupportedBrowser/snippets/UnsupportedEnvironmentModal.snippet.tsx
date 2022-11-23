// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton, Stack } from '@fluentui/react';
import { UnsupportedBrowser, UnsupportedBrowserVersion } from '@internal/react-components';
import React, { useState } from 'react';

import { useLocale } from '../../../../../react-components/src/localization';

export const UnsupportedEnvironmentModals: () => JSX.Element = () => {
  const locale = useLocale().strings.UnsupportedBrowser;
  const [modal1Open, setModal1Open] = useState<boolean>(false);
  const [modal2Open, setModal2Open] = useState<boolean>(false);
  return (
    <Stack horizontal>
      <PrimaryButton
        style={{ margin: 'auto' }}
        onClick={() => {
          setModal1Open(true);
        }}
      >
        Open UnsupportedBrowser Modal
      </PrimaryButton>
      <PrimaryButton
        style={{ margin: 'auto' }}
        onClick={() => {
          setModal2Open(true);
        }}
      >
        Open UnsupportedBrowserVersion Modal
      </PrimaryButton>
      <Modal isOpen={modal1Open} onDismiss={() => setModal1Open(false)}>
        <UnsupportedBrowser
          strings={locale}
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Modal>
      <Modal isOpen={modal2Open} onDismiss={() => setModal2Open(false)}>
        <UnsupportedBrowserVersion
          strings={locale}
          onTroubleshootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Modal>
    </Stack>
  );
};

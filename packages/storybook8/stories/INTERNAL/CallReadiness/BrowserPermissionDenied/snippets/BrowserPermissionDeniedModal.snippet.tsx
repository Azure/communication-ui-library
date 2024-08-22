// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Modal, PrimaryButton } from '@fluentui/react';
import { BrowserPermissionDenied } from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../../../react-components/src/localization';

export const BrowserPermissionDeniedModal: () => JSX.Element = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const locale = useLocale().strings.BrowserPermissionDenied;
  return (
    <>
      <PrimaryButton onClick={() => setModalOpen(true)}>Open Browser Permission Denied Modal</PrimaryButton>
      <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)}>
        <BrowserPermissionDenied
          onTroubleshootingClick={() => {
            alert('clicked troubleshooting');
          }}
          onTryAgainClick={() => {
            alert('clicked on try again button');
          }}
          strings={locale}
        />
      </Modal>
    </>
  );
};

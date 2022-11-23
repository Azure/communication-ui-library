// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton } from '@fluentui/react';
import { UnsupportedBrowserVersion } from '@internal/react-components';
import React, { useState } from 'react';

import { useLocale } from '../../../../../react-components/src/localization';

export const UnsupportedBrowserVersionModal: () => JSX.Element = () => {
  const locale = useLocale().strings.UnsupportedBrowser;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <>
      <PrimaryButton
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Open UnsupportedBrowserVersion Modal
      </PrimaryButton>
      <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)}>
        <UnsupportedBrowserVersion
          strings={locale}
          onTroubleshootingClick={() => {
            alert('CompatibilityLink');
          }}
        />
      </Modal>
    </>
  );
};

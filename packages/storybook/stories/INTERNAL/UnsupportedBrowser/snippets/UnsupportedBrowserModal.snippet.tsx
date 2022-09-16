// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton } from '@fluentui/react';
import { UnsupportedBrowser } from '@internal/react-components';
import React, { useState } from 'react';

import { useLocale } from '../../../../../react-components/src/localization';

export const UnsupportedBrowserModal: () => JSX.Element = () => {
  const locale = useLocale().strings.UnsupportedBrowser;
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  return (
    <>
      <PrimaryButton
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Open Unsupported Browser Modal
      </PrimaryButton>
      <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)}>
        <UnsupportedBrowser
          strings={locale}
          onTroubleShootingClick={() => {
            alert('clicked help link');
          }}
        />
      </Modal>
    </>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton } from '@fluentui/react';
import { CameraAndMicrophoneDomainPermissions } from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../../../react-components/src/localization';

export const DomainPermissionsModal: () => JSX.Element = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const locale = useLocale().strings.CameraAndMicrophoneDomainPermissions;
  return (
    <>
      <PrimaryButton onClick={() => setModalOpen(true)}>Open Domain Permissions Modal</PrimaryButton>
      <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)}>
        <CameraAndMicrophoneDomainPermissions
          appName={'Contoso app'}
          onTroubleshootingClick={() => {
            alert('clicked trouble shooting');
          }}
          strings={locale}
          type={'request'}
        />
      </Modal>
    </>
  );
};

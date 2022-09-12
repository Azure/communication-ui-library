// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton } from '@fluentui/react';
import { _DomainPermissions } from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../../../react-components/src/localization';

export const DomainPermissionsModal: () => JSX.Element = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const locale = useLocale().strings.DomainPermissions;
  return (
    <>
      <PrimaryButton onClick={() => setModalOpen(true)}>Open Domain Permissions Modal</PrimaryButton>
      <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)}>
        <_DomainPermissions
          appName={'Contoso app'}
          onTroubleshootingClick={() => {
            alert('clicked trouble shooting');
          }}
          strings={locale}
        />
      </Modal>
    </>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton } from '@fluentui/react';
import { CameraAndMicrophoneSitePermissions } from '@internal/react-components';
import React, { useState } from 'react';
import { useLocale } from '../../../../../../react-components/src/localization';

export const SitePermissionsModal: () => JSX.Element = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const locale = useLocale().strings.CameraAndMicrophoneSitePermissionsRequest;
  return (
    <>
      <PrimaryButton onClick={() => setModalOpen(true)}>Open Site Permissions Modal</PrimaryButton>
      <Modal isOpen={modalOpen} onDismiss={() => setModalOpen(false)}>
        <CameraAndMicrophoneSitePermissions
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Modal, PrimaryButton, Stack } from '@fluentui/react';
import { _DomainPermissions, _DrawerSurface } from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { useLocale } from '../../../../../react-components/src/localization';
import { SingleLineBetaBanner } from '../../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { MobilePreviewContainer } from '../../../MobileContainer';

const DomainPermissionsStory = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const locale = useLocale().strings.DomainPermissions;
  const [isDrawerShowing, setIsDrawerShowing] = useState(true);
  const onLightDismissTriggered = (): void => setIsDrawerShowing(false);
  return (
    <Stack>
      <Stack>
        <Title>DomainPermissions Component</Title>
        <SingleLineBetaBanner />
        <Description>
          Component to display information to the end user when their device permissions are not set appropriately
        </Description>
        <Heading>Example DevicePermissions</Heading>
      </Stack>
      <Canvas>
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
      </Canvas>
      <MobilePreviewContainer>
        {!isDrawerShowing && (
          <Stack
            styles={{ root: { cursor: 'pointer' } }}
            verticalFill
            verticalAlign="center"
            horizontalAlign="center"
            onClick={() => setIsDrawerShowing(true)}
          >
            Click to show drawer
          </Stack>
        )}
        {isDrawerShowing && (
          <_DrawerSurface onLightDismiss={onLightDismissTriggered}>
            <_DomainPermissions
              appName={'Contoso app'}
              onTroubleshootingClick={() => alert('clicked trouble shooting link')}
              strings={locale}
            />
          </_DrawerSurface>
        )}
      </MobilePreviewContainer>
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const DomainPermissions = DomainPermissionsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-domain-permissions`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/Domain Permissions`,
  component: _DomainPermissions
} as Meta;

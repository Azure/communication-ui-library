// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { DomainPermissions as DomainPermissionsComponent, _DrawerSurface } from '@internal/react-components';
import { Canvas, Description, Heading, Props, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useLocale } from '../../../../../react-components/src/localization';
import { SingleLineBetaBanner } from '../../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { DomainPermissionsDrawer } from './snippets/DomainPermissionsDrawer.snippet';
import { DomainPermissionsModal } from './snippets/DomainPermissionsModal.snippet';

const DomainPermissionsDrawerExample = require('!!raw-loader!./snippets/DomainPermissionsDrawer.snippet.tsx').default;
const DomainPermissionsModalExample = require('!!raw-loader!./snippets/DomainPermissionsModal.snippet.tsx').default;

const DomainPermissionsStory = (): JSX.Element => {
  const locale = useLocale().strings.DomainPermissions;
  return (
    <Stack>
      <DomainPermissionsComponent
        appName={'Contoso App'}
        onTroubleshootingClick={function (): void {
          alert('you clicked the help text');
        }}
        strings={locale}
      />
    </Stack>
  );
};

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <Stack>
      <SingleLineBetaBanner />
      <Title>Domain Permissions</Title>
      <Description>
        Component to display information to the end user when their device permissions are not set appropriately
      </Description>
      <Heading>Using in a modal</Heading>
      <Description>
        you are able to hide the DomainPermissions component in a Modal to show the help tile over your applications
        user interface.
      </Description>
      <Canvas mdxSource={DomainPermissionsModalExample}>
        <DomainPermissionsModal />
      </Canvas>
      <Heading>Using on mobile</Heading>
      <Canvas mdxSource={DomainPermissionsDrawerExample}>
        <DomainPermissionsDrawer />
      </Canvas>
      <Props of={DomainPermissionsComponent} />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const DomainPermissions = DomainPermissionsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-domain-permissions`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/Domain Permissions`,
  component: DomainPermissionsComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

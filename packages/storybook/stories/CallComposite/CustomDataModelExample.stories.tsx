// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { getDocs } from './CallCompositeDocs';
import { CustomDataModelExampleContainer } from './snippets/CustomDataModelExampleContainer.snippet';
import { createUserAndGroup } from './snippets/Server.snippet';
import { ConfigHintBanner } from './snippets/Utils';

const CustomDataModelStory = (args): JSX.Element => {
  const [containerProps, setContainerProps] = useState();

  useEffect(() => {
    const fetchContainerProps = async (): Promise<void> => {
      if (args.connectionString && args.displayName) {
        const newProps = await createUserAndGroup(args.connectionString);
        setContainerProps(newProps);
      } else {
        setContainerProps(undefined);
      }
    };
    fetchContainerProps();
  }, [args.connectionString, args.displayName]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <CustomDataModelExampleContainer
          displayName={args.displayName}
          avatarInitials={args.avatarInitials}
          {...containerProps}
          callInvitationURL={args.callInvitationURL}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const CustomDataModelExample = CustomDataModelStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-customdatamodelexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Custom Data Model Example`,
  component: CallComposite,
  argTypes: {
    connectionString: { control: 'text', defaultValue: '', name: COMPOSITE_STRING_CONNECTIONSTRING },
    displayName: { control: 'text', defaultValue: '', name: 'Display Name' },
    avatarInitials: { control: 'text', defaultValue: 'A B', name: 'Avatar initials' },
    callInvitationURL: {
      control: 'text',
      defaultValue: '',
      name: 'Optional URL to invite other participants to the call'
    },
    // Hiding auto-generated controls
    adapter: { control: false, table: { disable: true } },
    fluentTheme: { control: false, table: { disable: true } },
    onRenderAvatar: { control: false, table: { disable: true } },
    identifiers: { control: false, table: { disable: true } },
    locale: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { v1 as createGUID } from 'uuid';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './CallCompositeDocs';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { ConfigHintBanner } from './snippets/Utils';

type ContainerProps = {
  token: string;
  userId: CommunicationUserIdentifier;
  locator: string;
};

const BasicStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  useEffect(() => {
    const fetchContainerProps = async (): Promise<void> => {
      if (!!args.userId && !!args.token) {
        const containerProps = {
          userId: { communicationUserId: args.userId },
          token: args.token,
          locator: createGUID()
        };
        setContainerProps(containerProps);
      } else {
        setContainerProps(undefined);
      }
    };
    fetchContainerProps();
  }, [args.connectionString, args.displayName]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoCallContainer
          fluentTheme={context.theme}
          displayName={args.displayName}
          {...containerProps}
          callInvitationURL={args.callInvitationURL}
          locale={compositeLocale(locale)}
          options={{ mobileView: args.mobileView, errorBar: args.errorBar }}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const BasicExample = BasicStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-basicexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Basic Example`,
  component: CallComposite,
  argTypes: {
    token: controlsToAdd.token,
    userId: controlsToAdd.userId,
    displayName: controlsToAdd.displayName,
    mobileView: controlsToAdd.mobileView,
    callInvitationURL: controlsToAdd.callInvitationURL,
    errorBar: controlsToAdd.showErrorBar,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

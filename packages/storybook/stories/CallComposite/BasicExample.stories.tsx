// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useMemo } from 'react';
import { v1 as createGUID } from 'uuid';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd, ArgsFrom } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './CallCompositeDocs';
import { ContosoCallContainer } from './snippets/Container.snippet';
import { ConfigHintBanner } from './snippets/Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  compositeFormFactor: controlsToAdd.formFactor,
  callInvitationURL: controlsToAdd.callInvitationURL,
  errorBar: controlsToAdd.showErrorBar
};

const BasicStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  // const {
  //   globals: { locale }
  // } = context;

  const containerProps = useMemo(() => {
    if (args.userId && args.token) {
      const containerProps = {
        userId: { communicationUserId: args.userId },
        token: args.token,
        locator: createGUID()
      };
      return containerProps;
    }
    return undefined;
  }, [args.userId, args.token]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoCallContainer
          // fluentTheme={context.theme}
          displayName={args.displayName}
          {...containerProps}
          // callInvitationURL={args.callInvitationURL}
          // locale={compositeLocale(locale)}
          // formFactor={args.compositeFormFactor}
          // options={{ errorBar: args.errorBar }}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export default {
  // id: `${COMPOSITE_FOLDER_PREFIX}-call-basicexample`,
  name: `CallComposite`,
  component: BasicStory,
  // argTypes: {
  //   ...storyControls,
  //   // Hiding auto-generated controls
  //   ...defaultCallCompositeHiddenControls
  // },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

export const Empty = {
  args: {
    token:
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjVFODQ4MjE0Qzc3MDczQUU1QzJCREU1Q0NENTQ0ODlEREYyQzRDODQiLCJ4NXQiOiJYb1NDRk1kd2M2NWNLOTVjelZSSW5kOHNUSVEiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOmRkOTc1M2MwLTZlNjItNGY3NC1hYjBmLWM5NGY5NzIzYjRlYl8wMDAwMDAxYS0yYTMwLTJjNzgtNjMzMS04ZTNhMGQwMGJhYTEiLCJzY3AiOjE3OTIsImNzaSI6IjE2OTAyNDI1NDkiLCJleHAiOjE2OTAzMjg5NDksInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6ImNoYXQsdm9pcCIsInJlc291cmNlSWQiOiJkZDk3NTNjMC02ZTYyLTRmNzQtYWIwZi1jOTRmOTcyM2I0ZWIiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNjkwMjQyNTQ5fQ.R1ornckX79kZWEjc-bo8Ddha2OGmwHjzX2U1dN67dQZMULeZskwWzrcaHEMJ-DCAQAWrBB66jAkzkssJLtmj1jptg7okqNvjqBTEL9KRwgiszAOZfpZ5TofvGZ5-GJmc1QGnXpjBtZ_n-dQcc6YQVpWtoEJFRLYlopifhAD5SegSe1qXigZMWhsK3oGNabhizT6uqRTojiuN44Z86yd-352wMEZprIF5r2uFjd4cUSulquVyNirNKSYs9WciodKL316pEgXPfCgUo0QP9jhOjrfTIUfM7YWq-iNdb7UcL_Czc_Ar-OpQfq-gRkCr5llDkpYw5y_hiV_JehogNtVa_g',
    userId: '8:acs:dd9753c0-6e62-4f74-ab0f-c94f9723b4eb_0000001a-2a30-2c78-6331-8e3a0d00baa1',
    displayName: 'test user'
  }
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useMemo } from 'react';
import { v1 as createGUID } from 'uuid';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultCallCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { compositeLocale } from '../localizationUtils';
import { getDocs } from './CallCompositeDocs';
import { CustomButtonInjectionExampleContainer } from './snippets/CustomButtonInjectionExampleContainer.snippet';
import { ConfigHintBanner } from './snippets/Utils';

const CustomButtonInjectionStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;

  const containerProps = useMemo(() => {
    if (args.userId && args.token) {
      const containerProps = {
        userId: args.userId,
        token: args.token,
        locator: createGUID()
      };
      return containerProps;
    }
    return undefined;
  }, [args.token, args.userId]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <CustomButtonInjectionExampleContainer
          fluentTheme={context.theme}
          displayName={args.displayName}
          {...containerProps}
          callInvitationURL={args.callInvitationURL}
          locale={compositeLocale(locale)}
          formFactor={args.formFactor}
          displayCustomButton={args.customButton}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const CustomButtonInjectionExample = CustomButtonInjectionStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-custombuttoninjectionexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallComposite/Custom Button Injection Example`,
  component: CallComposite,
  argTypes: {
    userId: controlsToAdd.userId,
    token: controlsToAdd.token,
    displayName: controlsToAdd.displayName,
    formFactor: controlsToAdd.formFactor,
    callInvitationURL: controlsToAdd.callInvitationURL,
    customButton: controlsToAdd.customButton,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

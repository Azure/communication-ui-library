// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * THIS COMPONENT HAS BEEN REMOVED FROM @internal/react-compoNENTS PACKAGE.
 * AS SUCH THIS STORY HAS BEEN MARKED 'REMOVED' HOWEVER MAY BE RETURNED
 * WHEN THE COMPOSITE ERROR HANDLING STORY HAS BEEN COMPLETED.
 */

import { ErrorBar as ErrorBarComponent, ErrorType } from '@azure/communication-react';
import { mergeStyles, useTheme } from '@fluentui/react';
import { Description, Heading, Props, Subheading, Title } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React, { useCallback, useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>ErrorBar</Title>
      <Description>
        `ErrorBar` is a wrapper on fluent UI's `MessageBar` with additional features for surfacing Azure Communication
        Services errors on the UI consistently.
      </Description>
      <Description>Set the `showErrorBar` option for `ChatComposite` to use an `ErrorBar` to show errors.</Description>
      <Subheading>Localization</Subheading>
      <Description>
        Similar to other UI components in this library, `ErrorBarProps` accepts all strings shown on the UI as a
        `strings` field. The `activeErrors` field selects from these strings to show in the `ErrorBar` UI.
      </Description>
      <Subheading>Multiple errors</Subheading>
      <Description>
        More than one error can occur at the same time. The `ErrorBar` component can show multiple active errors. To
        avoid confusing the user, it is important to be mindful to limit the total number of errors that are shown
        together.
      </Description>
      <Heading>ErrorBar Props</Heading>
      <Props of={ErrorBarComponent} />
    </>
  );
};

const errorOptions: { [key in ErrorType]: ErrorType } = {
  unableToReachChatService: 'unableToReachChatService',
  accessDenied: 'accessDenied',
  userNotInThisThread: 'userNotInThisThread',
  sendMessageNotInThisThread: 'sendMessageNotInThisThread',
  sendMessageGeneric: 'sendMessageGeneric'
};

const ErrorBarStory = (args): JSX.Element => {
  const theme = useTheme();

  const [activeErrors, setActiveErrors] = useState<ErrorType[]>(args.errorTypes);
  const onClose = useCallback((toRemove: ErrorType[]) => {
    const toRemoveSet = new Set(toRemove);
    setActiveErrors(activeErrors.filter((e) => !toRemoveSet.has(e)));
  }, []);

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '50%'
      })}
    >
      <ErrorBarComponent activeErrors={activeErrors} onDismissErrors={onClose} />
    </div>
  );
};
export const ErrorBar = ErrorBarStory.bind({});

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Error Bar`,
  component: ErrorBarComponent,
  argTypes: {
    errorTypes: {
      control: { type: 'check', options: errorOptions },
      defaultValue: ['accessDenied'],
      name: 'ErrorType'
    },
    // Hiding auto-generated controls
    activeErrors: { control: false, table: { disable: true } },
    strings: { control: false, table: { disable: true } },
    onDismissErrors: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * THIS COMPONENT HAS BEEN REMOVED FROM @internal/react-compoNENTS PACKAGE.
 * AS SUCH THIS STORY HAS BEEN MARKED 'REMOVED' HOWEVER MAY BE RETURNED
 * WHEN THE COMPOSITE ERROR HANDLING STORY HAS BEEN COMPLETED.
 */

import { ErrorBar, ErrorType } from '@azure/communication-react';
import { mergeStyles, useTheme } from '@fluentui/react';
import { Description, Heading, Props, Subheading, Title } from '@storybook/addon-docs/blocks';
import { radios } from '@storybook/addon-knobs';
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
      <Subheading>Localization</Subheading>
      <Description>
        Similar to other UI components in this library, `ErrorBarProps` accepts all strings shown on the UI as a
        `strings` field. The `activeErrors` field selects from these strings to show in the `ErrorBar` UI.
      </Description>
      <Heading>ErrorBar Props</Heading>
      <Props of={ErrorBar} />
    </>
  );
};

const errorOptions: { [key in ErrorType]: ErrorType } = {
  sendMessageGeneric: 'sendMessageGeneric'
};

export const SendMessageError = (): JSX.Element => {
  const theme = useTheme();

  const errorType = radios('ErrorType', errorOptions, 'sendMessageGeneric');
  const [enabledState, setEnabledState] = useState<boolean>(true);
  const onClose = useCallback(() => {
    setEnabledState(false);
  }, [setEnabledState]);

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '50%'
      })}
    >
      {enabledState ? <ErrorBar activeErrors={[errorType]} onDismissErrors={onClose} /> : <></>}
    </div>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Error Bar`,
  component: ErrorBar,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

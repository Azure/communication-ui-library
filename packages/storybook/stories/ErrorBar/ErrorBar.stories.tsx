// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * THIS COMPONENT HAS BEEN REMOVED FROM @internal/react-compoNENTS PACKAGE.
 * AS SUCH THIS STORY HAS BEEN MARKED 'REMOVED' HOWEVER MAY BE RETURNED
 * WHEN THE COMPOSITE ERROR HANDLING STORY HAS BEEN COMPLETED.
 */

import { ErrorBar } from '@internal/react-components';
import { Description, Heading, Props, Title } from '@storybook/addon-docs/blocks';
import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useCallback, useState } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ErrorBar</Title>
      <Description of={ErrorBar} />

      <Heading>ErrorBar Props</Heading>
      <Props of={ErrorBar} />
    </>
  );
};

export const SendMessageError = (): JSX.Element => {
  const enabled = boolean('Sending message failed', true);
  const [enabledState, setEnabledState] = useState<boolean>(enabled);
  const onClose = useCallback(() => {
    setEnabledState(false);
  }, [setEnabledState]);

  if (!enabledState) {
    return <></>;
  }
  return <ErrorBar activeError="sendMessageGeneric" onClearActiveError={onClose} />;
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

// © Microsoft Corporation. All rights reserved.

import { Meta } from '@storybook/react/types-6-0';
import React, { useState } from 'react';
import { CommunicationUiErrorSeverity, ErrorBar } from '@azure/communication-ui';
import { text, select } from '@storybook/addon-knobs';
import { COMPONENT_FOLDER_PREFIX } from '../constants';

export const ErrorBarComponent: () => JSX.Element = () => {
  const [closed, setClosed] = useState<boolean>(false);
  const message = text('Message', 'This is a sample error message.');
  const severity = select<CommunicationUiErrorSeverity>(
    'Severity',
    CommunicationUiErrorSeverity,
    CommunicationUiErrorSeverity.ERROR
  );
  const onClearError = (): void => {
    setClosed(true);
  };

  if (!closed) {
    return <ErrorBar message={message} severity={severity} onClose={onClearError} />;
  } else {
    return <></>;
  }
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ErrorBar`,
  component: ErrorBar
} as Meta;

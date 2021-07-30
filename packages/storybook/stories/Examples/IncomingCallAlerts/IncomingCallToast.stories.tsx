// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { IncomingCallToast as IncomingCallToastComponent } from '@internal/react-composites';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { getDocs } from './IncomingCallAlertsDocs';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';

const IncomingCallToastStory: (args) => JSX.Element = (args) => {
  return (
    <Stack>
      <IncomingCallToastComponent
        callerName={args.callerName}
        alertText={args.alertText}
        avatar={args.images.length > 0 ? args.images[0] : undefined}
        onClickAccept={() => null}
        onClickReject={() => null}
      />
    </Stack>
  );
};

export const Toast = IncomingCallToastStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-incomingcallalerts-toast`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Incoming Call Alerts/Toast`,
  component: IncomingCallToastComponent,
  argTypes: {
    callerName: { control: 'text', defaultValue: 'John Doe', name: 'Caller Name' },
    alertText: { control: 'text', defaultValue: 'Incoming Call', name: 'Alert Text' },
    images: { control: 'file', accept: '.jpeg, .jpg, .png', defaultValue: [], name: 'Avatar' },
    // Hiding auto-generated controls
    avatar: { control: false, table: { disable: true } },
    onClickAccept: { control: false, table: { disable: true } },
    onClickReject: { control: false, table: { disable: true } }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

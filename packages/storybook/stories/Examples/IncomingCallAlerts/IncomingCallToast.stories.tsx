// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { IncomingCallToast as IncomingCallToastComponent } from './components';
import { getToastDocs } from './IncomingCallAlertsDocs';

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

export const IncomingCallToast = IncomingCallToastStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-incomingcallalerts-incomingcalltoast`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Incoming Call Alerts/Incoming Call Toast`,
  component: IncomingCallToastComponent,
  argTypes: {
    callerName: controlsToAdd.callerName,
    alertText: controlsToAdd.callToastAlertText,
    images: controlsToAdd.callerImages,
    // Hiding auto-generated controls
    avatar: hiddenControl,
    onClickAccept: hiddenControl,
    onClickReject: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getToastDocs()
    }
  }
} as Meta;

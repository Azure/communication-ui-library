// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import React from 'react';
import { IncomingCallToast as IncomingCallToastComponent } from '../components';

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

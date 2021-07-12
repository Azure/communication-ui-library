// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { IncomingCallToast as IncomingCallToastComponent } from '@internal/react-composites';
import { text, files } from '@storybook/addon-knobs';
import React from 'react';

export const IncomingCallToast: () => JSX.Element = () => {
  const callerName = text('Caller Name', 'John Doe');
  const alertText = text('Alert Text', 'Incoming Call');
  const images = files('Avatar', '.jpeg, .jpg, .png', []);

  return (
    <Stack>
      <IncomingCallToastComponent
        callerName={callerName}
        alertText={alertText}
        avatar={images.length > 0 ? images[0] : undefined}
        onClickAccept={() => null}
        onClickReject={() => null}
      />
    </Stack>
  );
};

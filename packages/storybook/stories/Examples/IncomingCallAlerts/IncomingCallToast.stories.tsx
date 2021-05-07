// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { text, files } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { IncomingCallToast } from 'react-composites';
import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { getDocs } from './IncomingCallAlertsDocs';

export const IncomingCallToastComponent: () => JSX.Element = () => {
  const callerName = text('Caller Name', 'John Doe');
  const alertText = text('Alert Text', 'Incoming Call');
  const images = files('Avatar', '.jpeg, .jpg, .png', []);

  return (
    <Stack>
      <IncomingCallToast
        callerName={callerName}
        alertText={alertText}
        avatar={images.length > 0 ? images[0] : undefined}
        onClickAccept={() => null}
        onClickReject={() => null}
      />
    </Stack>
  );
};

export default {
  title: `${EXAMPLES_FOLDER_PREFIX}/IncomingCallAlerts`,
  component: IncomingCallToast,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

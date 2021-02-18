// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Meta } from '@storybook/react/types-6-0';
import { IncomingCallToast } from '../components/IncomingCallAlerts';
import { text, files } from '@storybook/addon-knobs';
import { getDocs } from './docs/IncomingCallToastDocs';

export const IncomingCallToastComponent: () => JSX.Element = () => {
  const callerName = text('Caller Name', 'John Doe');
  const alertText = text('Alert Text', 'Incoming Call');
  const images = files('Avatar', '.jpeg, .jpg, .png', []);

  return (
    <IncomingCallToast
      callerName={callerName}
      alertText={alertText}
      avatar={images.length > 0 ? images[0] : undefined}
      onClickAccept={() => null}
      onClickReject={() => null}
    />
  );
};

export default {
  title: 'ACS Components/IncomingCallToast',
  component: IncomingCallToastComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

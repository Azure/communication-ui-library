// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Dialpad } from '@azure/communication-react';
import React from 'react';

export const DialerExample: (props: { isMobile?: boolean }) => JSX.Element = (props: { isMobile?: boolean }) => {
  return <Dialpad dialpadMode={'dialer'} longPressTrigger={props.isMobile ? 'touch' : 'mouseAndTouch'} />;
};

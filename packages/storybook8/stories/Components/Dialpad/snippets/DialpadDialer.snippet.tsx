// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Dialpad } from '@azure/communication-react';
import React from 'react';

export const DialerExample: (props: { isTouchOnlyDevice?: boolean }) => JSX.Element = (props: {
  isTouchOnlyDevice?: boolean;
}) => {
  return <Dialpad dialpadMode={'dialer'} longPressTrigger={props.isTouchOnlyDevice ? 'touch' : 'mouseAndTouch'} />;
};

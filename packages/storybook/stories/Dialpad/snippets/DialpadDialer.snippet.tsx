// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Dialpad } from '@azure/communication-react';
import React from 'react';

export const DialerExample: () => JSX.Element = () => {
  return <Dialpad dialpadMode={'dialer'} />;
};

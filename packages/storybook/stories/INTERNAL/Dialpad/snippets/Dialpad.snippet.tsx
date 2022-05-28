// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _Dialpad } from '@internal/react-components';
import React from 'react';

const dialpadStrings = {
  defaultText: 'Enter a number'
};

export const DialpadExample: () => JSX.Element = () => {
  return <_Dialpad strings={dialpadStrings} />;
};

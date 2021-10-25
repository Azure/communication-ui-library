// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CompositeConnectionParamsErrMessage } from '../../CompositeStringUtils';

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide the access token and userId and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinCallHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide a token, call locator, and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

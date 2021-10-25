// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CompositeConnectionParamsErrMessage } from '../CompositeStringUtils';

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide the token, userId, endpointUrl and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinMeetingHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide the token, userId, endpointUrl, display name and Teams meeting link to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

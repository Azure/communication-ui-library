// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CompositeConnectionParamsErrMessage } from '../CompositeStringUtils';

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide an access token, userId, endpointUrl and display name to use.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinMeetingHintBanner = (): JSX.Element => {
  const emptyConfigTips =
    'Please provide the an access token, userId, endpointUrl, display name, and teams meeting link.';
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

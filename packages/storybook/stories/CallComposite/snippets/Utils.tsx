// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CompositeConnectionParamsErrMessage, CreateIdentityLink } from '../../CompositeStringUtils';

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = 'Please provide an access token, userId and display name to use.';
  return (
    <>
      {CompositeConnectionParamsErrMessage([emptyConfigTips])}
      {CreateIdentityLink()}
    </>
  );
};

export const ConfigJoinCallHintBanner = (): JSX.Element => {
  const emptyConfigTips =
    'Please provide an access token, userId, display name, and a group call Id (or a teams meeting link).';
  return (
    <>
      {CompositeConnectionParamsErrMessage([emptyConfigTips])}
      {CreateIdentityLink()}
    </>
  );
};

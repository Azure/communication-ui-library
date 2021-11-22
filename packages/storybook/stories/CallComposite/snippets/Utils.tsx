// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CompositeConnectionParamsErrMessage } from '../../CompositeStringUtils';
import { MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART } from '../../constants';

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token, userId
      </a>{' '}
      and display name to use.
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinCallHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token, userId
      </a>
      , display name, and a group call Id (or a teams meeting link).
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CompositeConnectionParamsErrMessage } from '../CompositeStringUtils';
import { MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART } from '../constants';

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token
      </a>
      , userId, endpointUrl and display name to use.
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinMeetingHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide the an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token
      </a>
      , userId, endpointUrl, display name, and teams meeting link.
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

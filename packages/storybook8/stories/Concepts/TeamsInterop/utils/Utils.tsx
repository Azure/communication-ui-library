// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART } from '../../constants';
import { CompositeConnectionParamsErrMessage } from './CompositeStringUtils';

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <div>
      <p>
        Please provide an{' '}
        <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
          access token, userId
        </a>
        , endpointUrl and display name to use.
      </p>
      <p>A display name has already been set by default, but feel free to change it.</p>
    </div>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigJoinMeetingHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide the an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token, userId
      </a>
      , endpointUrl, display name, and teams meeting link.
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

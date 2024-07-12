// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { CompositeConnectionParamsErrMessage } from '../../../CompositeStringUtils';
import { MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART } from '../../../constants';

export const ConfigHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token, userId
      </a>
      .
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
      , display name, and a call locator.
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigStart1ToNHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token, userId
      </a>
      , and display name. <br />
      If you would like to experience an incoming call, replace the default value for <br />
      Callee's User identifier with a userId with an associated access token. <br />
      <br />
      This preview only samples a 1:1 calling scenario. However, to initiate a call <br />
      with multiple users in an app, a string of user Ids is required by the Call Locator.
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

export const ConfigStartPSTNHintBanner = (): JSX.Element => {
  const emptyConfigTips = (
    <p>
      Please provide an{' '}
      <a href={MICROSOFT_AZURE_ACCESS_TOKEN_QUICKSTART} target="_blank" rel="noreferrer">
        access token, userId
      </a>
      , display name, alternate caller id, and a call locator.
    </p>
  );
  return <>{CompositeConnectionParamsErrMessage([emptyConfigTips])}</>;
};

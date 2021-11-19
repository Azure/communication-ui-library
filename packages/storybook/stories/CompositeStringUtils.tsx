// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

export const COMPOSITE_STRING_CONNECTIONSTRING = 'Connection String';
export const COMPOSITE_STRING_REQUIREDCONNECTIONSTRING = 'Connection String is required to run the {0} widget.';

export const CompositeConnectionParamsErrMessage = (errors: string[]): JSX.Element => (
  <>
    {errors.map((error) => {
      return error ? <span key={error}>{error}</span> : null;
    })}
  </>
);

export const CreateIdentityLink = (): JSX.Element => {
  const identityLink =
    'https://docs.microsoft.com/azure/communication-services/quickstarts/identity/quick-create-identity';
  return (
    <>
      <a href={identityLink}>Refer to our documentation for generating test identities and tokens.</a>
    </>
  );
};

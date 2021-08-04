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

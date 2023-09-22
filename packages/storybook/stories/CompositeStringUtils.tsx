// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';

export const CompositeConnectionParamsErrMessage = (errors: JSX.Element[]): JSX.Element => (
  <>
    {errors.map((error, idx) => {
      return error ? <span key={idx}>{error}</span> : null;
    })}
  </>
);

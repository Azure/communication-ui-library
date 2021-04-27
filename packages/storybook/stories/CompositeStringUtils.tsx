// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Stack } from '@fluentui/react';

export const Composite_String_ConnectionString = 'ACS Connection String';
export const Composite_String_RequiredConnectionString = 'Connect String is required to run the {0} widget.';

export const CompositeConnectionParamsErrMessage = (errors: string[]): JSX.Element => (
  <Stack horizontalAlign="center" verticalAlign="center" style={{ height: '100%', width: '100%' }}>
    {errors.map((error) => {
      return !!error ? <span key={error}>{error}</span> : null;
    })}
  </Stack>
);

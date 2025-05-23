// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _formatString } from '@internal/acs-ui-common';
import { Stack } from '@fluentui/react';

/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const TogetherModeLayout = (props: { togetherModeStreamComponent: JSX.Element }): JSX.Element => {
  const { togetherModeStreamComponent } = props;
  return <Stack>{togetherModeStreamComponent}</Stack>;
};

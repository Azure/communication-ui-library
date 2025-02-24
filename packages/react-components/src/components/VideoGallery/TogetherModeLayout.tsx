// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(together-mode) */
import React from 'react';
/* @conditional-compile-remove(together-mode) */
import { _formatString } from '@internal/acs-ui-common';
/* @conditional-compile-remove(together-mode) */
import { Stack } from '@fluentui/react';

/* @conditional-compile-remove(together-mode) */
/**
 * A memoized version of local screen share component. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const TogetherModeLayout = (props: { togetherModeStreamComponent: JSX.Element }): JSX.Element => {
  const { togetherModeStreamComponent } = props;
  return <Stack>{togetherModeStreamComponent}</Stack>;
};

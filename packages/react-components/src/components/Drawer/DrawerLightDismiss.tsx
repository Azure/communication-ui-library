// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IStackStyles, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';
import { BaseCustomStyles } from '../../types';

/**
 * An element that fills the space the DrawerContentContainer does not take up.
 * This is the element that enables the light dismiss feature.
 *
 * @private
 */
export const DrawerLightDismiss = (props: { onDismiss: () => void; styles?: BaseCustomStyles }): JSX.Element => {
  return (
    <Stack className={mergeStyles(lightDismissContainerStyles, props.styles)} grow onClick={() => props.onDismiss()} />
  );
};

const lightDismissContainerStyles: IStackStyles = { root: { height: '100%' } };

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStackStyles, Stack } from '@fluentui/react';
import React from 'react';

/**
 * An element that fills the space the DrawerContentContainer does not take up.
 * This is the element that enables the light dismiss feature.
 *
 * @private
 */
export const DrawerLightDismiss = (props: { onDismiss: () => void }): JSX.Element => {
  return <Stack styles={lightDismissContainerStyles} grow onClick={() => props.onDismiss()} />;
};

const lightDismissContainerStyles: IStackStyles = { root: { height: '100%' } };

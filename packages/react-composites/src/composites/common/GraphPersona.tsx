// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { _useIsSignedIn } from '@internal/acs-ui-common';
import { Person, PersonProps, PersonCardInteraction, PersonViewType } from '@microsoft/mgt-react';
import React from 'react';
import { AvatarPersonaData } from './AvatarPersona';

/** @private */
export interface GraphPersonaProps extends PersonProps {
  personQuery: string;
  overrideData?: AvatarPersonaData;
}

/** @private */
export const GraphPersona = (props: GraphPersonaProps): JSX.Element => (
  <Stack horizontalAlign="center" verticalAlign="center" verticalFill>
    <Stack.Item style={{ cursor: props.personCardInteraction !== PersonCardInteraction.none ? 'pointer' : 'none' }}>
      <Person
        {...props}
        view={props.view ?? PersonViewType.avatar}
        avatarSize={props.avatarSize ?? 'large'}
        personCardInteraction={props.personCardInteraction ?? PersonCardInteraction.hover}
      />
    </Stack.Item>
  </Stack>
);

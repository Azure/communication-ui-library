// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  AccessibilityComponentRef,
  AccessibilityProvider as AccessibilityProviderComponent,
  ParticipantList,
  useAccessibility
} from '@azure/communication-react';
import { Stack, Panel, DefaultButton } from '@fluentui/react';
import React, { useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AccessibilityProviderStory = (props: any): JSX.Element => {
  return (
    <AccessibilityProviderComponent>
      <Children></Children>
    </AccessibilityProviderComponent>
  );
};

const Children = (): JSX.Element => {
  const [showPane, setShowPane] = useState(false);
  const accessibility = useAccessibility();
  const componentRef = useRef<AccessibilityComponentRef>(null);
  const mockParticipants = [
    { displayName: 'Tom', isRemovable: true, userId: 'acs:test:1234' },
    { displayName: 'Jerry', isRemovable: true, userId: 'acs:test:1234' }
  ];
  return (
    <Stack
      styles={{ root: { width: '100%', height: '100%', padding: '3rem' } }}
      horizontalAlign="center"
      verticalAlign="center"
    >
      <DefaultButton
        componentRef={componentRef}
        iconProps={{ iconName: 'Panel Right Add' }}
        onClick={() => setShowPane(!showPane)}
      >
        {'Participants'}
      </DefaultButton>
      <Panel
        onDismiss={() => {
          setShowPane(false);
          accessibility?.componentRef?.focus();
        }}
        isOpen={showPane}
        headerText="AccessibilityProvider Example"
      >
        <ParticipantList participants={mockParticipants}></ParticipantList>
      </Panel>
    </Stack>
  );
};

export const AccessibilityProvider = AccessibilityProviderStory.bind({});

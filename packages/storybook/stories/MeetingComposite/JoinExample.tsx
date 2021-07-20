// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../constants';
import { MeetingExperience, MeetingExampleProps } from './snippets/Meeting.snippet';
import { createUserCredentials } from './snippets/Server.snippet';
import { ConfigJoinMeetingHintBanner } from './Utils';

export const JoinExample: () => JSX.Element = () => {
  const [meetingProps, setMeetingProps] = useState<MeetingExampleProps>();

  const knobs = useRef({
    connectionString: text(COMPOSITE_STRING_CONNECTIONSTRING, '', 'Join Existing Call'),
    displayName: text('Display Name', '', 'Join Existing Call'),
    teamsMeetingLink: text('Teams meeting link', '', 'Join Existing Call')
  });

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (!!knobs.current.connectionString && !!knobs.current.displayName && !!knobs.current.teamsMeetingLink) {
        const newProps = await createUserCredentials(
          knobs.current.connectionString,
          knobs.current.displayName,
          knobs.current.teamsMeetingLink
        );
        setMeetingProps(newProps);
      }
    };
    fetchToken();
  }, [knobs]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: COMPOSITE_EXPERIENCE_CONTAINER_STYLE }}>
      {meetingProps ? <MeetingExperience {...meetingProps} /> : <ConfigJoinMeetingHintBanner />}
    </Stack>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text } from '@storybook/addon-knobs';
import React, { useState, useEffect, useRef } from 'react';
import { COMPOSITE_STRING_CONNECTIONSTRING } from '../CompositeStringUtils';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../constants';
import { MeetingExperience, MeetingExampleProps } from './snippets/Meeting.snippet';
import { createUserCredentials } from './snippets/Server.snippet';

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
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {meetingProps ? <MeetingExperience {...meetingProps} /> : <>Complete the required fields below.</>}
    </div>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { controlsToAdd, defaultMeetingCompositeHiddenControls } from '../controlsUtils';
import { getDocs } from './MeetingCompositeDocs';
import { MeetingExperience, MeetingExampleProps } from './snippets/Meeting.snippet';
import { createUserCredentials } from './snippets/Server.snippet';
import { ConfigHintBanner } from './Utils';

const BasicStory = (args, context): JSX.Element => {
  const [meetingProps, setMeetingProps] = useState<MeetingExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.connectionString && args.displayName) {
        const newProps = await createUserCredentials(args.connectionString, args.displayName);
        setMeetingProps(newProps);
      } else {
        setMeetingProps(undefined);
      }
    };
    fetchToken();
  }, [args.connectionString, args.displayName]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {meetingProps ? <MeetingExperience fluentTheme={context.theme} {...meetingProps} /> : <ConfigHintBanner />}
    </Stack>
  );
};

export const BasicExample = BasicStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-meeting-basicexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/MeetingComposite/Basic Example`,
  component: MeetingComposite,
  argTypes: {
    connectionString: controlsToAdd.connectionString,
    displayName: controlsToAdd.displayName,
    // Hiding auto-generated controls
    ...defaultMeetingCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

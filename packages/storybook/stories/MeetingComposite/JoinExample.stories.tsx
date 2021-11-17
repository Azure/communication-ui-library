// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MeetingComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { controlsToAdd, defaultMeetingCompositeHiddenControls } from '../controlsUtils';
import { FloatingSingleLineBetaBanner } from '../DocBanners';
import { getDocs } from './MeetingCompositeDocs';
import { MeetingExperience, MeetingExampleProps } from './snippets/Meeting.snippet';
import { createCallLocator } from './snippets/Server.snippet';
import { ConfigJoinMeetingHintBanner } from './Utils';

const JoinExistingMeetingStory = (args, context): JSX.Element => {
  const [meetingProps, setMeetingProps] = useState<MeetingExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (!!args.token && !!args.userId && !!args.endpointUrl && !!args.displayName && !!args.teamsMeetingLink) {
        const newProps = await createCallLocator(
          args.token,
          args.userId,
          args.endpointUrl,
          args.displayName,
          args.teamsMeetingLink
        );
        setMeetingProps(newProps);
      } else {
        setMeetingProps(undefined);
      }
    };
    fetchToken();
  }, [args.token, args.userId, args.endpointUrl, args.displayName, args.teamsMeetingLink]);

  return (
    <>
      <FloatingSingleLineBetaBanner />
      <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
        {meetingProps ? (
          <MeetingExperience fluentTheme={context.theme} {...meetingProps} />
        ) : (
          <ConfigJoinMeetingHintBanner />
        )}
      </Stack>
    </>
  );
};

export const JoinExample = JoinExistingMeetingStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-meeting-joinexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/MeetingComposite/Join Example`,
  component: MeetingComposite,
  argTypes: {
    token: controlsToAdd.token,
    userId: controlsToAdd.userId,
    endpointUrl: controlsToAdd.endpointUrl,
    displayName: controlsToAdd.displayName,
    teamsMeetingLink: controlsToAdd.teamsMeetingLink,
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

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallWithChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { ArgsFrom, controlsToAdd, defaultCallWithChatCompositeHiddenControls } from '../controlsUtils';
import { Docs } from './CallWithChatCompositeDocs';
import { CallWithChatExampleProps } from './snippets/CallWithChat.snippet';
import { CallWithChatExperienceWithErrorChecks } from './snippets/CallWithChatWithErrorChecks.snippet';
import { ConfigJoinMeetingHintBanner } from './Utils';

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  endpointUrl: controlsToAdd.endpointUrl,
  displayName: controlsToAdd.requiredDisplayName,
  teamsMeetingLink: controlsToAdd.teamsMeetingLink,
  formFactor: controlsToAdd.formFactor,
  richTextEditor: controlsToAdd.richTextEditor
};

const JoinTeamsMeetingStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const [meetingProps, setMeetingProps] = useState<CallWithChatExampleProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (!!args.token && !!args.userId && !!args.endpointUrl && !!args.displayName && !!args.teamsMeetingLink) {
        setMeetingProps({
          userId: { communicationUserId: args.userId },
          token: args.token,
          displayName: args.displayName,
          endpointUrl: args.endpointUrl,
          locator: { meetingLink: args.teamsMeetingLink },
          compositeOptions: { richTextEditor: args.richTextEditor }
        });
      } else {
        setMeetingProps(undefined);
      }
    };
    fetchToken();
  }, [args.token, args.userId, args.endpointUrl, args.displayName, args.teamsMeetingLink, args.richTextEditor]);

  return (
    <>
      <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
        {meetingProps ? (
          <CallWithChatExperienceWithErrorChecks
            fluentTheme={context.theme}
            rtl={context.globals.rtl === 'rtl'}
            {...meetingProps}
          />
        ) : (
          <ConfigJoinMeetingHintBanner />
        )}
      </Stack>
    </>
  );
};

export const JoinTeamsMeeting = JoinTeamsMeetingStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-call-with-chat-jointeamsmeeting`,
  title: `${COMPOSITE_FOLDER_PREFIX}/CallWithChatComposite/Join Teams Meeting`,
  component: CallWithChatComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallWithChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      //Prevent Docs auto scroll to top
      container: null,
      page: () => Docs()
    }
  }
} as Meta;

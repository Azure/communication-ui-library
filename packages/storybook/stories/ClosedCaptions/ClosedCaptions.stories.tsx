// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { PrimaryButton, Stack } from '@fluentui/react';
import { Description, Heading, Source, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { CONCEPTS_FOLDER_PREFIX, overviewPageImagesStackStyle } from '../constants';
import { exampleDisableCaptions } from './ClosedCaptions';

const getDocs: () => JSX.Element = () => {
  /* eslint-disable react/no-unescaped-entities */
  return (
    <>
      <Title>Closed Captions</Title>
      <Description>
        Azure Communication Services UI Library is adding support for Closed Captions. Closed captions is a powerful
        tool that enables developers to enhance the accessibility of their videos. With closed captions, developers can
        provide a textual representation of the audio content in their videos, making it easier for users who are deaf
        or hard of hearing to follow along.
      </Description>
      <Description>
        Closed Captions is supported by default and are automatically included within the CallComposite and
        CallWithChatComposite experiences.
      </Description>

      <Heading>Azure Communication Service Based Captions</Heading>
      <SingleLineBetaBanner topOfPage={true} />
      <Description>
        Azure Communication Service Closed Captions are supported by default and are automatically included within the
        CallComposite and CallWithChatComposite experiences for calling scenarios involving Azure Communication Service
        users only. Captions can be enabled in both Mobile Web sessions and in Desktop Web sessions.
      </Description>
      <Description>
        For Azure Communication Service captions, users can enable captions in the menu and select the spoken language
        for the captions. Captions does not detect language automatically, so the spoken language selected needs to
        match the language that will be used in the call. Currently, Azure Communication Service captions does not
        support translation.
      </Description>

      <Heading>Teams Interop Closed Captions</Heading>
      <Description>
        Teams Interop Closed Captions is supported by default and are automatically included within the CallComposite
        and CallWithChatComposite experiences during a call including one or more teams users.
      </Description>
      <Description>
        The main difference between Azure Communication Service Closed Captions and Teams Interop Closed Captions is
        that Teams Interop Closed Captions supports translation. End users can choose to have captions translated to a
        different language by using captions settings.
      </Description>

      <Heading>How to use Captions</Heading>
      <Description>
        Captions is automatically included within the CallComposite and CallWithChatComposite experiences. To turn on
        captions, users need to navigate to the control bar after call is connected, and click on more button. Inside
        the menu pop up, click on Turn on captions.
      </Description>
      <Description>
        The spoken language is set to English by default. Your end user can use the UI to change the spoken language if
        a different language is being used in the meeting. This changes this spoken language for all users in the call.
      </Description>
      <Description>
        The caption language (Teams Interop Closed Captions) is set to English by default. Change it by clicking on the
        Caption Settings button after captions has already started if user prefers the captions to be translated to a
        different language.
      </Description>
      <Stack tokens={{ childrenGap: '3rem' }} style={overviewPageImagesStackStyle}>
        <Stack.Item align="center">
          <Subheading>Using the more menu to turn on captions</Subheading>
          <img
            style={{ width: '100%' }}
            src="images/StartCaptions.png"
            alt="example of component that can be used for starting captions"
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Subheading>Captions Setting modal to change spoken language</Subheading>
          <img
            style={{ width: '100%' }}
            src="images/CaptionsSettings.png"
            alt="example of component that can be used for setting languages for captions"
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Subheading>Captions Setting modal to change spoken language and caption language</Subheading>
          <img
            style={{ width: '100%' }}
            src="images/TeamsCaptionsSettings.png"
            alt="example of component that can be used for setting languages for teams captions"
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Subheading>Captions started</Subheading>
          <img
            style={{ width: '100%' }}
            src="images/Captions.png"
            alt="example of component that can be used for displaying captions"
          />
        </Stack.Item>
        <PrimaryButton
          style={{ width: 'fit-content' }}
          text="Go to CallComposite to see captions in action"
          href="../?path=/story/composites-call-basicexample--basic-example"
        />
      </Stack>

      <Heading>Disable captions</Heading>
      <Description>
        The UI Library enables users to hide captions UI when they do not wish to use the captions service.
      </Description>

      <Source code={exampleDisableCaptions} />
    </>
  );
};

const ClosedCaptionsStory = (): JSX.Element => {
  return <></>;
};

export const ClosedCaptions = ClosedCaptionsStory.bind({});

export default {
  id: `${CONCEPTS_FOLDER_PREFIX}-ClosedCaptions`,
  title: `${CONCEPTS_FOLDER_PREFIX}/ClosedCaptions`,
  parameters: {
    previewTabs: { canvas: { disable: true, hidden: true } },
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

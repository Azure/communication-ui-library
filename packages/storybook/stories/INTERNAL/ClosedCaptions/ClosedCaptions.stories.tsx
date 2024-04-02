// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Description, Heading, Source, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useMemo } from 'react';
import { v1 as createGUID } from 'uuid';
import { SingleLineBetaBanner } from '../../BetaBanners/SingleLineBetaBanner';
import { ContosoCallContainer } from '../../CallComposite/snippets/Container.snippet';
import { ConfigHintBanner } from '../../CallWithChatComposite/Utils';
import {
  COMPONENT_FOLDER_PREFIX,
  compositeExperienceContainerStyle,
  overviewPageImagesStackStyle
} from '../../constants';
import { ArgsFrom, controlsToAdd, defaultCallCompositeHiddenControls } from '../../controlsUtils';
import { compositeLocale } from '../../localizationUtils';
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
        Closed Captions is enabled by default and are automatically included within the CallComposite and
        CallWithChatComposite experiences.
      </Description>

      <Heading>ACS Based Captions</Heading>
      <SingleLineBetaBanner topOfPage={true} />
      <Description>
        ACS Closed Captions are enabled by default and are automatically included within the CallComposite and
        CallWithChatComposite experiences for calling scenarios involving ACS users only. Captions can be enabled both
        in Mobile Web sessions and in Desktop Web sessions.
      </Description>
      <Description>
        For acs captions, users can enable captions in the menu and select the spoken language for the captions.
        Captions does not detect language automatically, so the spoken language selected needs to match the language
        that will be used in the call. Currently, ACS captions does not support translation.
      </Description>

      <Heading>Teams Interop Closed Captions</Heading>
      <Description>
        Teams Interop Closed Captions is enabled by default and are automatically included within the CallComposite and
        CallWithChatComposite experiences during a call including one or more teams users.
      </Description>
      <Description>
        The main difference between ACS Closed Captions and Teams Interop Closed Captions is that Teams Interop Closed
        Captions supports translation. End users can choose to have captions translated to a different language by using
        captions settings.
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
          <Description>Using the more menu to turn on captions.</Description>
          <img
            style={{ width: '100%' }}
            src="images/StartCaptions.png"
            alt="example of component that can be used for starting captions"
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Description>Captions Setting modal to change spoken language.</Description>
          <img
            style={{ width: '100%' }}
            src="images/CaptionsSettings.png"
            alt="example of component that can be used for setting languages for captions"
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Description>Captions Setting modal to change spoken language and caption language.</Description>
          <img
            style={{ width: '100%' }}
            src="images/TeamsCaptionsSettings.png"
            alt="example of component that can be used for setting languages for teams captions"
          />
        </Stack.Item>
        <Stack.Item align="center">
          <Description>Captions is started.</Description>
          <img
            style={{ width: '100%' }}
            src="images/Captions.png"
            alt="example of component that can be used for displaying captions"
          />
        </Stack.Item>
      </Stack>

      <Subheading>Disable captions</Subheading>
      <Description>
        The UI Library enables users to hide captions UI when they do not wish to use the captions service.
      </Description>

      <Source code={exampleDisableCaptions} />
    </>
  );
};

const storyControls = {
  userId: controlsToAdd.userId,
  token: controlsToAdd.token,
  displayName: controlsToAdd.requiredDisplayName,
  compositeFormFactor: controlsToAdd.formFactor,
  errorBar: controlsToAdd.showErrorBar
};

const ClosedCaptionsStory = (args: ArgsFrom<typeof storyControls>, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;

  const containerProps = useMemo(() => {
    if (args.userId && args.token) {
      const containerProps = {
        userId: { communicationUserId: args.userId },
        token: args.token,
        locator: createGUID()
      };
      return containerProps;
    }
    return undefined;
  }, [args.userId, args.token]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoCallContainer
          fluentTheme={context.theme}
          rtl={context.globals.rtl === 'rtl'}
          displayName={args.displayName}
          {...containerProps}
          locale={compositeLocale(locale)}
          formFactor={args.compositeFormFactor}
          options={{ errorBar: args.errorBar }}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const ClosedCaptions = ClosedCaptionsStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-ClosedCaptions`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/ClosedCaptions`,
  component: CallComposite,
  argTypes: {
    ...storyControls,
    // Hiding auto-generated controls
    ...defaultCallCompositeHiddenControls
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

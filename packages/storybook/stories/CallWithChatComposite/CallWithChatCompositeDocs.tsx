// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageBar } from '@fluentui/react';
import { Title, Description, Heading, Source } from '@storybook/addon-docs';
import React from 'react';
import { DetailedBetaBanner } from '../BetaBanners/DetailedBetaBanner';

const containerText = require('!!raw-loader!./snippets/CallWithChat.snippet.tsx').default;
const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

const formFactorSnippet = `
<CallWithChatComposite formFactor="mobile" />
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <DetailedBetaBanner />
      <Title>CallWithChatComposite</Title>
      <Description>
        CallWithChatComposite brings together key components to provide a full call with chat experience out of the box.
      </Description>
      <Heading>Basic usage</Heading>
      <Description>
        A CallWithChatComposite is comprised of two key underlying parts: an ACS Call and an ACS Chat thread. As such
        you must provide details for both in the CallWithChatAdapter interface.
      </Description>
      <Description>
        A key thing to note is that initialization of the adapter is asynchronous. Thus, the initialization step
        requires special handling, as the example code below shows.
      </Description>
      <Source code={containerText} />

      <Heading>Prerequisites</Heading>
      <Description>
        CallWithChatComposite provides the UI for an *existing user* to join a call and a chat. Thus, the user and
        thread must be created beforehand. Typically, the user and group call or teams meeting are created on a
        Contoso-owned service and provided to the client application that then passes it to the CallWithChatComposite.
      </Description>
      <Source code={serverText} />

      <Heading>Running in a Mobile browser</Heading>
      <Description>
        CallWithChatComposite by default is optimized for desktop views. To provide an optimized mobile experience, you
        may set the `formFactor` property to `"mobile"`. The CallWithChatComposite does not detect if it is running on
        mobile device vs desktop, instead you must identify if your clients device is a mobile device and set the
        `formFactor` property to `"mobile"`. This prop can be set at any time and immediately updates the composite UI
        to be optimized for a mobile device.
      </Description>
      <Source code={formFactorSnippet} />
      <MessageBar>
        Note: Only Protrait mode is supported when the `formFactor` is set to "mobile". Landscape mode is not supported.
      </MessageBar>
      <Description>
        You can try out the form factor property in the [CallWithChatComposite Basic
        Example](./?path=/story/composites-call-with-chat-basicexample--basic-example).
      </Description>

      <Heading>Theming</Heading>
      <Description>
        CallWithChatComposite can be themed with Fluent UI themes, just like the base components. Look at the
        [CallComposite theme example](./?path=/story/composites-call-themeexample--theme-example) to see theming in
        action or the [overall theming example](./?path=/docs/theming--page) to see how theming works for all the
        components in this UI library.
      </Description>

      <Heading>Joining a Teams Meeting</Heading>
      <Description>
        The [Joining a Teams Meeting](./?path=/story/composites-call-with-chat-jointeamsmeeting) preview provides an
        easy playground to join an existing Teams meeting. This is useful if you want to explore the composite in a
        Teams interop scenario.
      </Description>
    </>
  );
};

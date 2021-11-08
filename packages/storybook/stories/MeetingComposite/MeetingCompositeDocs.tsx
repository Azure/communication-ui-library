// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Title, Description, Heading, Source } from '@storybook/addon-docs';
import React from 'react';

const containerText = require('!!raw-loader!./snippets/Meeting.snippet.tsx').default;
const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

const mobileViewSnippet = `
<MeetingComposite options={mobileView: true} />
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MeetingComposite</Title>
      <Description>
        MeetingComposite brings together key components to provide a full meeting experience out of the box.
      </Description>
      <Heading>Basic usage</Heading>
      <Description>
        A meeting composite is comprised of two key underlying parts: an ACS Call and an ACS Chat thread. As such you
        must provide details for both in the meeting adapter interface.
      </Description>
      <Description>
        A key thing to note is that initialization of the adapter is asynchronous. Thus, the initialization step
        requires special handling, as the example code below shows.
      </Description>
      <Source code={containerText} />

      <Heading>Prerequisites</Heading>
      <Description>
        MeetingComposite provides the UI for an *existing user* to join a call and a chat. Thus, the user and thread
        must be created beforehand. Typically, the user and group call or teams meeting are created on a Contoso-owned
        service and provided to the client application that then passes it to the MeetingComposite.
      </Description>
      <Source code={serverText} />

      <Heading>Running in a Mobile browser</Heading>
      <Description>
        MeetingComposite has been designed for both desktop views and mobile views. By default the MeetingComposite UI
        is optimized for desktop views and *does not* do any automatic detection if it is running on a mobile. To have
        an optimized UI on mobile you can use the `mobileView` flag:
      </Description>
      <Source code={mobileViewSnippet} />
      <Description>
        You can try out the mobile view in the [MeetingComposite Basic
        Example](./?path=/story/composites-meeting-basicexample--basic-example).
      </Description>

      <Heading>Theming</Heading>
      <Description>
        MeetingComposite can be themed with Fluent UI themes, just like the base components. Look at the [CallComposite
        theme example](./?path=/story/composites-call-themeexample--theme-example) to see theming in action or the
        [overall theming example](./?path=/docs/theming--page) to see how theming works for all the components in this
        UI library.
      </Description>

      <Heading>Joining an existing Meeting</Heading>
      <Description>
        The [join meeting](./?path=/story/composites-meeting-joinexample--join-example) provides an easy playground to
        join an existing Azure Communication Services group call and chat thread, or an existing Teams meeting. This is
        useful if you want to explore the composite with multiple users or try out Teams interop scenarios.
      </Description>
    </>
  );
};

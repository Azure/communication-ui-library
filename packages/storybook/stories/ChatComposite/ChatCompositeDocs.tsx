// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Title, Description, Heading, Source, Props } from '@storybook/addon-docs';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { overviewPageImagesStackStyle } from '../constants';

const containerText = require('!!raw-loader!./snippets/Container.snippet.tsx').default;
const customDataModelExampleContainerText =
  require('!!raw-loader!./snippets/CustomDataModelExampleContainer.snippet.tsx').default;
const customDateTimeFormatExampleText = require('!!raw-loader!./snippets/CustomDateTimeFormat.snippet.tsx').default;
const customBehaviorExampleText = require('!!raw-loader!./snippets/CustomizeBehavior.snippet.tsx').default;
const hideTopicStatement = `
<ChatComposite options={{ topic: false}}>
`;
const showParticipantStatement = `
// Caution: the Participant Pane is a beta feature
<ChatComposite options={{ participantPane: true}}>
`;

const addFileSharingSnippet = `
<ChatComposite
adapter={chatAdapter}
options={{
  fileSharing: {
    uploadHandler: fileUploadHandler,
    /* If fileDownloadHandler is not provided. The file URL is opened in a new tab.
    You can find examples of fileDownloadHandler and fileUploadHandler in this tutorial
    https://docs.microsoft.com/en-us/azure/communication-services/tutorials/file-sharing-tutorial */
    downloadHandler: fileDownloadHandler,
    accept: 'image/png, image/jpeg, text/plain, .docx',
    multiple: true
  }
}} />
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ChatComposite</Title>
      <Description>
        ChatComposite provides a chat experience where user can send and receive messages. Message thread events such as
        typing indicators, whether the message has been successfully delivered or read, or participants entering and
        leaving the chat are displayed to the user as part of the chat thread. Here is a visual example of Chat
        composite.
      </Description>
      <Stack style={overviewPageImagesStackStyle}>
        <Stack.Item align="center">
          <img
            style={{ width: '100%' }}
            src="images/chatComposite_NoParticipantsList.png"
            alt="Chat composite with the participants list"
          />
        </Stack.Item>
      </Stack>
      <Description>
        Note that ChatComposite has a min width and height of respectively 17.5rem and 20rem (280px x 320px, with
        default rem at 16px).
      </Description>
      <Heading>Basic usage</Heading>
      <Description>
        There are two parts to the composite - a `ChatComposite` react component and a `ChatAdapter` that connects the
        react component to the backend APIs.
      </Description>
      <Description>
        The key thing to note is that initialization of `ChatAdapter` is asynchronous. Thus, the initialization step
        requires special handling, as the example code below shows.
      </Description>
      <Source code={containerText} />

      <Heading>Prerequisites</Heading>
      <Description>
        ChatComposite provides the UI for an *existing user* in an *existing thread*. Thus, the user and thread must be
        created beforehand. Typically, the user and thread are created on a Contoso-owned service and authentication
        tokens are served to the client application that then passes it to the ChatComposite.
      </Description>

      <Heading>Theming</Heading>
      <Description>
        ChatComposite can be themed with Fluent UI themes, just like the base components. Look at the [ChatComposite
        themes canvas](./?path=/story/composites-chat-themeexample--theme-example) to see theming in action or the
        [overall theming example](./?path=/story/theming--page) to see how theming works for all the components in this
        UI library.
      </Description>

      <Heading>Fonts</Heading>
      <Description>
        Custom fonts can be applied to the ChatComposite using the in built theming mechanism. Look at the
        [ChatComposite themes canvas](./?path=/story/composites-chat-themeexample--theme-example) to see custom fonts in
        action or the [overall theming example](./?path=/story/theming--page) to see how theming works for all the
        components in this UI library. Read more about fonts in [Fluent UI Typography
        here](https://developer.microsoft.com/fluentui#/styles/web/typography).
      </Description>

      <Heading>Icons</Heading>
      <Description>
        Custom icons can be applied to the Composite using `icons` prop exposed by the Composite. The `icons` prop
        accepts an object where you can provide a custom JSX element against an icon name key.
      </Description>

      <Heading>Hiding/Showing UI Elements</Heading>
      <Description>
        Some UI elements of the composite can be hidden if desired using the ChatAdapter `options` interface. Currently
        we support hiding the `Topic Header`:
      </Description>
      <Source code={hideTopicStatement} />

      <Heading>Participant Pane</Heading>
      <SingleLineBetaBanner />
      <Description>
        You can also show a `Participant Pane` to the right hand side of the chat that has support for removing users.
        The Participant pane is a `beta` feature. Currently it does not support mobile views and is subject to breaking
        changes.
      </Description>
      <Source code={showParticipantStatement} />

      <Heading>Running in a Mobile browser</Heading>
      <Description>
        Unlike the CallComposite and CallWithChatComposite, the ChatComposite has no `formFactor` property. Instead the
        composite is responsive to the container it is in and should perform optimally on mobile and desktop
        automatically.
      </Description>
      <Description>
        Mobile devices have a pull-down to refresh feature that may impact users from scrolling through messages in
        chat. A simple and effective way to disable the pull-down to refresh feature is to set an `overflow='hidden'` OR
        `touch-action='none'` style on the body element for your app.
      </Description>

      <Heading>Custom Data Model</Heading>
      <Description>
        It is a primary tenet of Azure Communication Services that customers bring their own user identities. Customers
        then use the Azure Communication Services identity service to create corresponding authentication tokens for
        their users. The ChatComposite allows developers to easily inject custom data associated with these user
        identities. Look at the [example
        canvas](./?path=/story/composites-chat-customdatamodelexample--custom-data-model-example) to see how the name
        and avatar displayed for users can be provided by Contoso.
      </Description>
      <Description>Note that, by default, the initials text color is setup to `white`</Description>
      <Source code={customDataModelExampleContainerText} />
      <Description>
        See the [Custom data model example documentation](./?path=/docs/customuserdatamodel--page) to understand how
        custom data model can be injected for all the components in this UI library.
      </Description>

      <Heading>Customize Behavior</Heading>
      <Description>
        The `ChatAdapter` makes it possible to arbitrarily modify the communication between the `ChatComposite`
        component and the Azure Communication Services backend. This adds powerful customization possibilities. The
        [Customized Behavior Example](./?path=/story/composites-chat-custombehaviorexample--custom-behavior-example)
        shows a way to intercept messages entered by the user and modify them before sending them on to the backend.
      </Description>
      <Source code={customBehaviorExampleText} />

      <Heading>Joining existing Chat</Heading>
      <Description>
        The [join existing chat
        thread](./?path=/story/composites-chat-joinexistingchatthread--join-existing-chat-thread) provides an easy
        playground to join an existing Azure Communication Services chat thread. This is useful if you want to explore
        the composite with multiple users.
      </Description>

      <Heading>Custom DateTime Format using Locale</Heading>
      <SingleLineBetaBanner />
      <Description>
        You can pass in a function that formats the datetime displayed in chat messages through Locale
      </Description>
      <Source code={customDateTimeFormatExampleText} />

      <Heading>Adding file sharing</Heading>
      <SingleLineBetaBanner />
      <Description>
        The Chat Composite supports file sharing capabilities in conjunction with your choice of a storage solution.
        Using the provided APIs, you can enable the composite to support uploading files and displaying them on the send
        box before sending, and the message thread once they have been sent or received. For an end to end tutorial on
        enabling file sharing with Azure Blob Storage as your choice of a storage solution, refer to our
        [tutorial](https://docs.microsoft.com/azure/communication-services/tutorials/file-sharing-tutorial). File
        sharing is supported for Teams interop scenarios by default.
      </Description>
      <Source code={addFileSharingSnippet} />

      <Heading>Chat Composite Props</Heading>
      <Props of={ChatComposite} />
    </>
  );
};

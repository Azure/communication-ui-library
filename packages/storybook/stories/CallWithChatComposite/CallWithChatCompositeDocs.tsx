// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Image, MessageBar, Stack } from '@fluentui/react';
import { Title, Description, Heading, Source } from '@storybook/addon-docs';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { overviewPageImagesStackStyle } from '../constants';

const containerText = require('!!raw-loader!./snippets/CallWithChat.snippet.tsx').default;
const serverText = require('!!raw-loader!./snippets/Server.snippet.tsx').default;

const formFactorSnippet = `
<CallWithChatComposite formFactor="mobile" />
`;

const addFileSharingSnippet = `
<CallWithChatComposite
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
      <Title>CallWithChatComposite</Title>
      <Description>
        CallWithChatComposite brings together key components to provide a full call with chat experience out of the box.
        Inside the experience users can configure their devices, participate in the call with video and see other
        participants, including those with video turned on. The experience includes chat capabilities like sending and
        receiving messages, and notifications for message thread events such as typing indicators, message receipts,
        participants entering and leaving the chat.
      </Description>
      <Stack horizontalAlign="center" style={overviewPageImagesStackStyle}>
        <Image
          src="images/call-with-chat-composite-hero.png"
          alt="Call with chat composite preview image"
          width="85%"
        />
      </Stack>
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
      <Stack horizontalAlign="center">
        <Image
          src="images/call-with-chat-composite-mobile-hero.png"
          alt="Call with chat composite mobile preview image"
        />
      </Stack>
      <MessageBar>
        Note: Only Portrait mode is supported when the `formFactor` is set to "mobile". Landscape mode is not supported.
      </MessageBar>
      <Description>
        You can try out the form factor property in the [CallWithChatComposite Basic
        Example](./?path=/story/composites-call-with-chat-basicexample--basic-example).
      </Description>
      <Description>
        Mobile devices have a pull-down to refresh feature that may impact users from scrolling through messages in
        chat. A simple and effective way to disable the pull-down to refresh feature is to set an `overflow='hidden'` OR
        `touch-action='none'` style on the body element for your app.
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

      <Heading>Customize Call Controls</Heading>
      <Description>
        CallWithChatComposite provides a set of default controls for the call that can be customized similar to
        CallComposite. Check out [Customize Call
        Controls](./?path=/docs/composites-call-basicexample--basic-example#customize-call-controls) to learn more.
      </Description>

      <Heading>Adding file sharing</Heading>
      <SingleLineBetaBanner />
      <Description>
        The CallWithChat Composite supports file sharing capabilities in conjunction with your choice of a storage
        solution. Using the provided APIs, you can enable the composite to support uploading files and displaying them
        on the send box before sending, and the message thread once they have been sent or received. For an end to end
        tutorial on enabling file sharing with Azure Blob Storage as your choice of a storage solution, refer to our
        [tutorial](https://docs.microsoft.com/azure/communication-services/tutorials/file-sharing-tutorial). File
        sharing is supported for Teams interop scenarios by default.
      </Description>
      <Source code={addFileSharingSnippet} />

      <Heading>PSTN and 1:N Calling</Heading>
      <SingleLineBetaBanner />
      <MessageBar>Note: see CallComposite for detailed implementation description</MessageBar>
      <Description>
        The CallWithChatComposite supports the PSTN Calling modality as well. With CallWithChat you will need to still
        provide a chat thread Id for instances where you will add a Azure Communications user to the call. If you are
        looking to use the CallWithChatComposite and are looking to hide the chat because you are only calling PSTN
        users please see our documentation on how to hide the [control bar
        buttons](./?path=/story/composites-call-with-chat-basicexample--basic-example).
      </Description>
    </>
  );
};

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Image, MessageBar, Stack } from '@fluentui/react';
import { Title, Description, Heading, Source, Subheading } from '@storybook/addon-docs';
import React, { useEffect, useRef } from 'react';
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
  attachmentOptions: {
    uploadOptions: {
      supportedMediaTypes: ['image/png', 'image/jpeg'],
      disableMultipleUploads: false,
      handler: attachmentUploadHandler
    },
    /* If downloadOptions is not provided. The file URL is opened in a new tab.
    You can find examples of downloadOptions and uploadOptions in this tutorial
    https://docs.microsoft.com/en-us/azure/communication-services/tutorials/file-sharing-tutorial */
    downloadOptions: {
      actionsForAttachment: (attachment: AttachmentMetadata, message?: ChatMessage): AttachmentMenuAction[] => {
        return [
          defaultAttachmentMenuAction,
          {
            name: 'Open',
            icon: <WindowNew24Regular />,
            onClick: () => {
              return new Promise((resolve) => {
                window.alert('open button clicked');
                resolve();
              });
            }
          }
        ];
      }
    }
  }
}} />
`;

const customBrandingSnippet = `
<CallWithChatComposite options={{
  branding: {
    logo: {
      url: 'https://...',
      alt: 'My company logo',
      shape: 'circle'
    },
    backgroundImage: {
      url: 'https://...'
    }
  }
}} />
`;

export const Docs: () => JSX.Element = () => {
  const refTeamsMeeting = useRef(null);
  const refFileSharing = useRef(null);
  const refImageSharing = useRef(null);
  const refImageSharingTeams = useRef(null);
  const refFileSharingACS = useRef(null);
  const refFileSharingTeams = useRef(null);
  const refRichTextEditor = useRef(null);
  const refPSTN = useRef(null);

  const scrollToRef = (ref): void => {
    ref.current.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    const url = document.URL;

    if (url.includes('adding-file-sharing') && refFileSharing.current) {
      scrollToRef(refFileSharing);
    } else if (url.includes('adding-image-sharing') && refImageSharing.current) {
      scrollToRef(refImageSharing);
    } else if (url.includes('inline-image-in-teams-interop-meeting-chat-thread') && refImageSharingTeams.current) {
      scrollToRef(refImageSharingTeams);
    } else if (url.includes('file-sharing-in-teams-interop-meeting-chat-thread') && refFileSharingTeams.current) {
      scrollToRef(refFileSharingTeams);
    } else if (url.includes('file-sharing-in-azure-communication-services-chat-thread') && refFileSharingACS.current) {
      scrollToRef(refFileSharingACS);
    } else if (url.includes('teams-meeting') && refTeamsMeeting.current) {
      scrollToRef(refTeamsMeeting);
    } else if (url.includes('rich-text-editor-support') && refRichTextEditor.current) {
      scrollToRef(refRichTextEditor);
    } else if (url.includes('pstn-and-1-n-calling') && refPSTN.current) {
      scrollToRef(refPSTN);
    }
  }, []);

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

      <Heading>Custom Branding</Heading>
      <Description>
        Along with applying a Fluent Theme to style the composites, you can also inject your own custom branding. You
        can inject a background and logo into the Composite configuration page to present to your users. This is done by
        passing background and logo properties to the `options` of the Composite.
      </Description>
      <Description>
        **Image recommendations.** The background image should be as simple and uncluttered as possible to avoid text
        becoming unreadable against the background. The background image should have a minimum size of 576x576 pixels
        and a maximum size of 2048x2048 pixels. The recommended size is 1280x720 pixels. The recommended size for the
        logo image is 128x128 pixels.
      </Description>
      <Stack horizontalAlign="center">
        <img
          style={{ width: '100%', maxWidth: '50rem' }}
          src="images/composite-logo-background.png"
          alt="CallWithChatComposite with a logo and background applied"
        />
      </Stack>
      <Source code={customBrandingSnippet} />
      <Heading>Customize Call Controls</Heading>
      <Description>
        CallWithChatComposite provides a set of default controls for the call that can be customized similar to
        CallComposite. Check out [Customize Call
        Controls](./?path=/docs/composites-call-basicexample--basic-example#customize-call-controls) to learn more.
      </Description>
      <div ref={refImageSharing}>
        <Heading>Adding image sharing</Heading>
      </div>
      <div ref={refImageSharingTeams}>
        <Subheading>Inline Image In Teams Interop Meeting Chat Thread</Subheading>
        <SingleLineBetaBanner />
        <Description>
          The Azure Communication Services end user can receive images shared by the Teams user without any additional
          setup when using the `CallWithChat` Composite in a Teams interop scenario,. Azure Communication Services end
          user would need to join the Teams meeting first, as soon as the Teams user sends a file from the Teams client,
          the Azure Communication Services end user will be see the image in the chat thread. Please check out the
          tutorial for [Enable inline image using UI Library in Teams Interoperability
          Chat](https://learn.microsoft.com/en-us/azure/communication-services/tutorials/inline-image-tutorial-interop-chat)
          for details.
        </Description>
      </div>
      <div ref={refFileSharing}>
        <Heading>Adding file sharing</Heading>
      </div>
      <div ref={refFileSharingACS}>
        <Subheading>File Sharing In Azure Communication Services Chat Thread</Subheading>
        <SingleLineBetaBanner />
        <Description>
          In a chat thread where all participants are Azure Communication Services end users, the `CallWithChat`
          Composite supports file capabilities in conjunction with your choice of a storage solution. Using the provided
          APIs, you can composite to support uploading files and displaying them on the send box before sending, and the
          once they have been sent or received. For an end to end tutorial on enabling file sharing with Azure Blob
          Storage as your choice of a storage solution, refer to our
          [tutorial](https://docs.microsoft.com/azure/communication-services/tutorials/file-sharing-tutorial).
        </Description>
        <Source code={addFileSharingSnippet} />
      </div>
      <div ref={refFileSharingTeams}>
        <Subheading>File Sharing In Teams Interop Meeting Chat Thread</Subheading>
        <Description>
          When using the `CallWithChat` Composite in a Teams interop scenario, the Azure Communication Services end user
          can recieve file attachments from Teams user without any additional setup. Simply join the Teams meeting as an
          Azure Communication Services end user, as soon as the Teams user sends a file from the Teams client, the Azure
          Communication Services end user will be able to see shared files in the chat thread.
        </Description>
      </div>

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
      <div ref={refRichTextEditor}>
        <Heading>Rich Text Editor Support</Heading>
        <SingleLineBetaBanner />
        <MessageBar>Note: see ChatComposite for detailed implementation description</MessageBar>
        <Description>
          The CallWithChatComposite supports options to enable a rich text editor functionality in chat similar to
          ChatComposite. Check out [Rich Text Editor Support for
          ChatComposite](./?path=/docs/composites-chat-basicexample--basic-example#rich-text-editor-support) to learn
          more.
        </Description>
      </div>
    </>
  );
};

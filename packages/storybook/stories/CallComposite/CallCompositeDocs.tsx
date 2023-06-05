// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallComposite } from '@azure/communication-react';
import { MessageBar, Stack, Text } from '@fluentui/react';
import { Description, Heading, Props, Source, Title } from '@storybook/addon-docs';
import React from 'react';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { overviewPageImagesStackStyle } from '../constants';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1

const containerText = require('!!raw-loader!./snippets/Container.snippet.tsx').default;
const customDataModelExampleContainerText =
  require('!!raw-loader!./snippets/CustomDataModelExampleContainer.snippet.tsx').default;

const formFactorSnippet = `
<CallComposite formFactor="mobile" />
`;

const cssSnippet = `
html,
body,
#root {
  height: 100%;
}
`;

const callParticipantsLocatorSnippet = `
// CallParticipantsLocator
{ participantIds: string[] }

// Example
{ participantsIDs: ["<phone #>", "<phone #>", "<ACS userId>", ...] }
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>CallComposite</Title>
      <Description>
        The CallComposite provides a calling experience that allows users to start or join a call. Inside the experience
        users can configure their devices, participate in the call with video and see other participants, including
        those with video turned on. Here are visual examples of Call composite where participants have their camera
        turned off, then some have them turned on. People speaking with microphone unmuted will have their tile
        appearing with a blue border.
      </Description>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: '2rem' }}
        style={overviewPageImagesStackStyle}
        wrap
      >
        <Stack.Item grow align="center" style={{ textAlign: 'center' }}>
          <img
            style={{ width: '100%', maxWidth: '25rem' }}
            src="images/callComposite_CamerasOff.png"
            alt="Call composite where all participants have their camera turned off"
          />
        </Stack.Item>
        <Stack.Item grow align="center" style={{ textAlign: 'center' }}>
          <img
            style={{ width: '100%', maxWidth: '25rem' }}
            src="images/callComposite_CamerasOn.png"
            alt="Call composite where some participants have their camera turned on"
          />
        </Stack.Item>
      </Stack>
      <Description>
        When joining a Microsoft Teams call ([Teams Interop
        experience](./?path=/docs/examples-teamsinterop-compliancebanner--compliance-banner)), the Call Composite
        includes a lobby experience where the user is waiting to be admitted into the call.
      </Description>
      <Stack
        horizontal
        horizontalAlign="space-between"
        tokens={{ childrenGap: '3rem' }}
        style={overviewPageImagesStackStyle}
        wrap
      >
        <Stack.Item grow align="center" style={{ textAlign: 'center' }}>
          <img
            style={{ width: '100%', maxWidth: '30rem' }}
            src="images/callComposite_TeamsInterop_WaitingLobby.png"
            alt="Call composite waiting to be admitted in a Teams meeting"
          />
        </Stack.Item>
        <Stack.Item grow align="center">
          <Stack horizontalAlign="center" tokens={{ childrenGap: '1rem' }}>
            <img
              style={{ width: '100%', maxWidth: '20rem' }}
              src="images/callComposite_TeamsInterop_AdmissionFromTeams.png"
              alt="Popup in Teams to admit ACS participants"
            />
            <Text style={{ textAlign: 'center' }}>{'Popup appearing in Teams to admit ACS participant.'}</Text>
          </Stack>
        </Stack.Item>
      </Stack>
      <Description>Note that CallComposite has the following min width and height:</Description>
      <Description>- mobile: 17.5rem x 21rem (280px x 336px, with default rem at 16px)</Description>
      <Description>- desktop: 30rem x 22rem (480px x 352px, with default rem at 16px)</Description>
      <Heading>Basic usage</Heading>
      <Description>
        There are two parts to the composite - a `CallComposite` react component and a `CallAdapter` that connects the
        react component to the backend APIs.
      </Description>
      <Description>
        The key thing to note is that initialization of `CallAdapter` is asynchronous. Thus, the initialization step
        requires special handling, as the example code below shows.
      </Description>
      <Source code={containerText} />

      <Heading>Prerequisites</Heading>
      <Description>
        CallComposite provides the UI for an *existing user* to join a call. The user must be created beforehand.
        Typically, the user and group call or teams meeting are created on a Contoso-owned service and provided to the
        client application that then passes it to the CallComposite.
      </Description>

      <Heading>Styling</Heading>
      <Description>
        CallComposite is designed to fill the space of the parent it is in. By default these examples put the composite
        in a container of a set height and width. If your composite is living outside of any parent container and you
        wish for it to fill the page, we recommend ensuring your react app is set to fill the screen by adding the
        following css to your primary css file:
      </Description>
      <Source code={cssSnippet} />

      <Heading>Running in a Mobile browser</Heading>
      <Description>
        CallComposite by default is optimized for desktop views. To provide an optimized mobile experience, you may set
        the `formFactor` property to `"mobile"`. The CallComposite does not detect if it is running on mobile device vs
        desktop, instead you must identify if your clients device is a mobile device and set the `formFactor` property
        to `"mobile"`. This prop can be set at any time and immediately updates the composite UI to be optimized for a
        mobile device.
      </Description>
      <Source code={formFactorSnippet} />
      <MessageBar>
        Note: Only Portrait mode is supported when the `formFactor` is set to "mobile". Landscape mode is not supported.
      </MessageBar>
      <Description>
        You can try out the form factor property in the [CallComposite Basic
        Example](./?path=/story/composites-call-basicexample--basic-example).
      </Description>

      <Heading>Theming</Heading>
      <Description>
        CallComposite can be themed with Fluent UI themes, just like the base components. Look at the [CallComposite
        theme example](./?path=/story/composites-call-themeexample--theme-example) to see theming in action or the
        [overall theming example](./?path=/docs/theming--page) to see how theming works for all the components in this
        UI library.
      </Description>

      <Heading>Custom Data Model</Heading>
      <Description>
        It is a primary tenet of Azure Communication Services that customers bring their own user identities. Customers
        then use the Azure Communication Services identity service to create corresponding authentication tokens for
        their users. The ChatComposite allows developers to easily inject custom data associated with these user
        identities. Look at the [example
        canvas](./?path=/story/composites-call-customdatamodelexample--custom-data-model-example) to see how the
        initials displayed for users can be provided by Contoso.
      </Description>
      <Description>Note that, by default, the initials text color is setup to `white`</Description>
      <Source code={customDataModelExampleContainerText} />
      <Description>
        See the [Custom data model example documentation](./?path=/docs/customuserdatamodel--page) to understand how
        custom data model can be injected for all the components in this UI library.
      </Description>

      <Heading>Fonts</Heading>
      <Description>
        Custom fonts can be applied to the CallComposite using the in built theming mechanism. Look at the
        [CallComposite themes canvas](./?path=/story/composites-call-themeexample--theme-example) to see custom fonts in
        action or the [overall theming example](./?path=/story/theming--page) to see how theming works for all the
        components in this UI library. Read more about fonts in [Fluent UI
        Typography](https://developer.microsoft.com/fluentui#/styles/web/typography).
      </Description>

      <Heading>Icons</Heading>
      <Description>
        Custom icons can be applied to the Composite using `icons` prop exposed by the Composite. The `icons` prop
        accepts an object where you can provide a custom JSX element against an icon name key.
      </Description>

      <Heading>Customize Call Controls</Heading>
      <Description>
        The `options` prop allows you to customize some parts of the Call Composite. This prop is of type
        [CallCompositeOptions](https://docs.microsoft.com/en-us/javascript/api/@azure/communication-react/callcompositeoptions?view=azure-node-latest).
        The `callControls` property can be used to customize the call controls. This property is of type
        [CallControlOptions](https://docs.microsoft.com/en-us/javascript/api/@azure/communication-react/callcontroloptions?view=azure-node-latest).
      </Description>
      <Description>For example, you can hide the camera button by using `callControls` as shown below:</Description>
      <Source code="<CallComposite options={{ callControls: { cameraButton: false } }} />" />
      <Description>
        You can display the call controls in a compact mode using `callControls` as shown below:
      </Description>
      <Source code="<CallComposite options={{ callControls: { displayType: 'compact' } }} />" />
      <Description>
        You can disable some call controls (refer to
        [CallControlOptions](https://docs.microsoft.com/en-us/javascript/api/@azure/communication-react/callcontroloptions?view=azure-node-latest))
        using `callControls` as shown below:
      </Description>
      <Source code="<CallComposite options={{ callControls: { screenShareButton: { disabled: true } } }} />" />

      <Heading>Customize Local Video Tile</Heading>
      <SingleLineBetaBanner version={'1.5.2-beta.1'} />
      <Description>
        Just like customizing the control bar we have some configuration options for the local video tile. These
        controls are to help facilitate different calling experiences like creating an audio only call.
      </Description>
      <Source code="<CallComposite options={localVideoTileOptions: { position: 'hidden'}} />" />
      <Description>
        This will hide the local video tile from the composite's video gallery. The default value is `floating` which
        will have the local video tile follow our `floatingLocalLayout`. The other option is `grid` which will place the
        local video tile in the grid view, see our [video
        gallery](./?path=/docs/ui-components-videogallery--video-gallery) component docs for more information
      </Description>

      <Heading>Joining an existing Call</Heading>
      <Description>
        The [join existing call](./?path=/story/composites-call-joinexistingcall--join-existing-call) provides an easy
        playground to join an existing Azure Communication Services group call or an existing Teams meeting. This is
        useful if you want to explore the composite with multiple users.
      </Description>

      <Heading>PSTN and 1:N Calling</Heading>
      <SingleLineBetaBanner version={'1.3.2-beta.1'} />
      <Description>
        The CallComposite supports making outbound PSTN and 1:N calls. 1:N is a call either between just Azure
        Communication Users or, a mix between ACS and PSTN users. To make these outbound calls you need to provide a
        `locator` that contains participantIds that you are looking to call to the
        [CallAdapter](./?path=/docs/composite-adapters--page). For PSTN these IDs are the phone numbers that you are
        looking to call. For Azure Communication Users you will need to provide their unique ACS acquired `userId`.
      </Description>
      <Source code={callParticipantsLocatorSnippet} />
      <Description>
        As well as these participantIds you are required to provide a [phone
        number](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/get-phone-number?tabs=windows&pivots=platform-azcli)
        known as an alternate caller ID from an Azure Communications resource to the composite's adapter for PSTN. This
        phone number serves as your caller ID when calling PSTN. This phone number is not required for calling other
        Azure Communications users, however, will be required if you are looking to call a ACS user and a PSTN user in
        the same call.
      </Description>

      <Heading>Rooms</Heading>
      <SingleLineBetaBanner version={'1.3.2-beta.1'} />
      <Description>
        The CallComposite supports [Rooms](./?path=/docs/rooms--page). To join a room call you need to provide a
        `locator` that contains the roomId of the room call you want to join to the
        [CallAdapter](./?path=/docs/composite-adapters--page). An example snippet is shown in the 'How to incorporate
        Rooms in your experience' section in our [Rooms doc](./?path=/docs/rooms--page).
      </Description>
      <Description>
        Note: A room needs be created using the Rooms Client to obtain a roomId. Also with the Rooms Client, ACS users
        need to be added to that room using their userId. To use the Rooms Client to create a room follow these
        [quickstarts](https://docs.microsoft.com/en-us/azure/communication-services/quickstarts/rooms/get-started-rooms).
      </Description>

      <Heading>Call Composite Props</Heading>
      <Props of={CallComposite} />
    </>
  );
};

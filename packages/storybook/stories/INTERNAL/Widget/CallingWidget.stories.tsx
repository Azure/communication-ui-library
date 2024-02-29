// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageBar, MessageBarType, Stack, registerIcons } from '@fluentui/react';
import React from 'react';
import { COMPOSITE_FOLDER_PREFIX } from '../../constants';
import { CallComposite } from '@azure/communication-react';
import { Meta } from '@storybook/react/types-6-0';
import { CallingWidgetComponentMock } from './snippets/CallingWidgetComponentMock.snippet';
import { CallAdd20Regular, Dismiss20Regular } from '@fluentui/react-icons';
import { Canvas, Description, Heading, Props, Source, Subheading, Title } from '@storybook/addon-docs';

registerIcons({
  icons: { dismiss: <Dismiss20Regular />, callAdd: <CallAdd20Regular /> }
});

const CallingWidgetComponentText = require('!!raw-loader!./snippets/CallingWidgetComponentText.snippet.tsx').default;

const endCallSubscriptionText = `
useEffect(() => {
  if (adapter) {
    adapter.on('callEnded', () => {
      /**
       * you will want to add your custom code here for after call behavior
       * from the widget
       */ 
    });
  }
}, [adapter]);
`;

const endCallAdapterDisposeText = `
useEffect(() => {
  if (adapter) {
    adapter.on('callEnded', () => {
      /**
       * This is where you will do any cleanup needed to reset the experience for the user 
       */ 
      adapter.dispose();
    });
  }
}, [adapter]);
`;

const compositeConfigurationSnippet = `
<CallComposite
  adapter={adapter}
  options={{
    callControls: {
      cameraButton: true,
      screenShareButton: true, // useful for scenarios like software support, users can share their whole screen
      moreButton: false,
      peopleButton: false,
      displayType: 'compact' // this makes the controls icons only and is highly recommended for the widget
    },
      // this should be enabled if you are using the camera button, floating forces the tile to be setup for desktop
      localVideoTile: { position: 'floating' }
  }}
/>`;

const callAdapterSetupSnippet = `
/**
 * create your arguments to give to your AzureCommunicationServicesCallAdapter
 * 
 * Note: it is important that these arguments are memoized  
 */
const callAdapterArgs = useMemo(() => {
  return {
    userId: props.userId,
    credential: credential,
    targetCallees: [props.teamsAppIdentifier] as StartCallIdentifier[],
    displayName: props.displayName,
    options: props.options
  };
}, [props.userId, props.teamsAppIdentifier.teamsAppId, credential, displayName]);

/**
 * create your adapter
 */
const adapter = createAzureCommunicationCallAdapter(callAdapterArgs);

return (
  // other widget code is needed we are just focusing on the start call button
  <PrimaryButton
    onClick={() => {
      if (displayName && adapter) {
        // Here we use the TartgetCallees to start the call
        adapter?.startCall(callAdapterArgs.targetCallees, {
          audioOptions: { muted: false }
        });
      }
    }}
  >
    StartCall
  </PrimaryButton>
`;

const callAdapterTransferSnippet = `
useEffect(() => {
    if (adapter) {
      adapter.on('callEnded', () => {
        /**
         * We only want to reset the widget state if the call that ended is the same as the current call.
         * 
         * We will see that there is a acceptedTransfer in the CallAdapter by checking state like so and not closing the
         * widget if the callee is being a transferred.
         */
        if (
          adapter.getState().acceptedTransferCallState &&
          adapter.getState().acceptedTransferCallState?.id !== callIdRef.current
        ) {
          return;
        }
        /**
         * We will only reset the widget here if the call that ended is the same as the current call.
         */ 
        setWidgetState('new');
      });
    
      /**
       * Here you can get any information from the call that the user is being transferred to.
       */
      adapter.on('transferAccepted', (e: TransferEventArgs) => {
        console.log('transferAccepted', e);
      });
    }
  }, [adapter]);
`;

const getDocs: () => JSX.Element = () => {
  return (
    <div>
      <Title>Calling Widget</Title>
      <Description>
        The Calling Widget is a wrapper around our `CallComposite` to better facilitate calling experiences that begin
        with one click. Please check out our tutorial on how to build this from scratch on [Microsoft
        Learn](https://learn.microsoft.com/en-us/azure/communication-services/tutorials/calling-widget/calling-widget-tutorial).
        To see the completed sample from this tutorial you can also checkout the Calling Widget in the [Azure
        Communication Services Javascript
        Quickstarts](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/ui-library-click-to-call)
        repo.
      </Description>
      <MessageBar messageBarType={MessageBarType.warning}>
        Note: Due to the complex nature of the widget all snippets are generalized for conceptual understanding. If you
        are wanting to checkout the full code for the widget please check out the
        <a
          href={
            'https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/ui-library-click-to-call'
          }
        >
          Calling Widget
        </a>{' '}
        quickstart
      </MessageBar>
      <Subheading>Try It Out</Subheading>
      <Canvas mdxSource={CallingWidgetComponentText}>
        <Stack horizontalAlign="center" style={{}}>
          <Stack
            style={{
              width: '100%',
              height: '25rem',
              position: 'relative',
              margin: 'auto',
              background:
                'url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmk3aWR2Nm5hNWYydDhwdHpjcmt0bWN5aXJjM2hyaGtpMjlwZGd1NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9JrkkDoJuU0FbdbUZU/giphy.gif)'
            }}
          >
            <CallingWidgetComponentMock />
          </Stack>
        </Stack>
      </Canvas>
      <Heading>Pre-requisites</Heading>
      <Description>
        There are a few things that need setting up before you can use the calling widget. These include:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>
          Setting up your{' '}
          <a
            href={
              'https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-teams-auto-attendant'
            }
          >
            Teams Auto Attendant
          </a>{' '}
          or{' '}
          <a
            href={
              'https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-teams-call-queue'
            }
          >
            Teams Call Queue
          </a>
        </li>

        <li>
          An Azure account with an active subscription.{' '}
          <a href={'https://azure.microsoft.com/free/?WT.mc_id=A261C142F'}>Create an account for free</a>.
        </li>
        <li>
          <a href={'https://nodejs.org/'}>Node.js</a> Active LTS and Maintenance LTS versions (Node 18.0.0 and above).
        </li>
        <li>
          An active Communication Services resource.{' '}
          <a
            href={
              'https://docs.microsoft.com/azure/communication-services/quickstarts/create-communication-resource?tabs=windows&pivots=platform-azp'
            }
          >
            Create a Communication Services resource
          </a>
          .
        </li>
      </ul>
      <Heading>Scenarios for using the widget</Heading>
      <Description>
        There are a lot of calling scenarios that require a quick way to start a call with little setup and speed to get
        a user in contact with support. The widget is designed to be a quick and easy way to start a call with minimal
        setup for end users. Some scenarios include:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Support chat</li>
        <li>Customer service</li>
        <li>Internal support</li>
      </ul>
      <Description>The widget allows for all of these scenarios to be embedded directly into your website.</Description>
      <Subheading>Features</Subheading>
      <Description>
        In order to facilitate these scenarios the calling widget includes the following features from the
        `CallComposite` to allow your users be supported the way you want them to.
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>
          <a href={'./?path=/docs/adhoc-calling--page'}>Adhoc calling to Teams Voice applications</a> - Teams provides
          solutions using a series of Call Queues and Auto Attendants to allow your customers connect with your agents
          in your{' '}
          <a
            className="sbdocs sbdocs-a"
            href="https://learn.microsoft.com/en-us/azure/communication-services/tutorials/contact-center"
          >
            Contact Center
          </a>{' '}
        </li>
        <li>
          <a href={'./?path=/docs/transfer--page'}>Call Transfer</a>
        </li>
        <li>
          {' '}
          <a href={'./?path=/docs/ui-components-dialpad--dialpad'}>DTMF Dialer</a> - This is so your users can interact
          with Teams voice applications with DTMF or voice
        </li>
        <li>
          <a href={'./?path=/docs/addingsounds--page'}>Calling sounds</a> - We provide with the `CallComposite` the
          ability to set calling event sounds to provide a more enriching experience for your users
        </li>
      </ul>
      <Heading>How does it fit into my application? </Heading>
      <Description>
        The Calling widget is a wrapper around our CallComposite. If you are wanting to integrate this experience into
        your web application you will want to use the component in either the root of the application, or in the section
        of your website that you want it to be displayed.
      </Description>
      <Description>
        The Calling widget is intended to float on top of the page allowing the user to keep interacting with your
        product while they are in a call. It is important that the widget live somewhere where it will not be subject to
        re-renders of your application when the user interacts with other elements on the page.
      </Description>
      <Description>
        Something to keep in mind when placing the widget in your application we have minimum sizes for our
        `CallComposite`. Keeping these in mind we need to make sure that the widget has enough space to transform into
        the `CallComposite` once the call begins. The min sizes are:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Height: `352px`</li>
        <li>Width: `480px`</li>
      </ul>
      <Subheading>Configurating the CallComposite</Subheading>
      <Description>
        Since the widget is a wrapper around the
        [CallComposite](./?path=/docs/composites-call-basicexample--basic-example) you can use any of the different
        properties that exist on the composite to make your widget experience unique to your needs. Keeping in mind the
        minimum sizes for the composite you will want to make sure that you are picking the correct call controls for
        your scenario.
      </Description>
      <Source code={compositeConfigurationSnippet}></Source>
      <Subheading>Using Mobile</Subheading>
      <Description>
        If you are wanting to create this experience on mobile, the recommendation here is to use the composite in the
        `mobile` formfactor. This will be the best experience for your users in a call as the widget will not be sized
        well for mobile devices.
      </Description>
      <Heading>Before and after the call</Heading>
      <Subheading>Before the Call</Subheading>
      <Description>
        When setting up your widget before the call it is important to understand the different information that you
        might want to ask the user. Our widget asks for consent to record the call, their name, and whether they want
        video controls. This is a good place to ask for information from that user like:
      </Description>
      <ul className={'sbdocs sbdocs-p'}>
        <li>Customer issue - By providing more context to your Agents you can better serve your customer</li>
        <li>
          Customer email - Should there be an issue or a need for a followup collecting user contact information can
          improve your ability to serve your customers if its a complex issue
        </li>
      </ul>
      <Description>
        These different fields for the user are the configuration screen for the user as the widget skips the
        `CallComposite` configuration screen. If you are collecting information from the user you will want to make sure
        that you are storing that information in a secure way.
      </Description>
      <Subheading>Starting the Call</Subheading>
      <Description>
        Since our widget is best utilized working with Teams Voice applications to start the call you will want to use
        our `AzureCommunicationServicesCallAdapter` with one of our adhoc approaches. This involves using an array of
        `TargetCallees` this will start an [Adhoc](./?path=/docs/adhoc-calling--page) call the Teams Voice Application
        you provide the identifier for. This can be done in the following way:
      </Description>
      <Source code={callAdapterSetupSnippet}></Source>
      <Subheading>Handling Transfers</Subheading>
      <Description>
        Depending on your scenario with your widget you might have to have the user transferred to an Agent or other
        support entity. Our Composite knows how to do this on its own, but you will want to make sure that you are
        handling the transfer in your widget. This can be done with the following code:
      </Description>
      <Source code={callAdapterTransferSnippet}></Source>
      <Subheading>After the Call</Subheading>
      <Description>
        Following the call you can provide many different options for the user. Using the `onCallEnded` event from the
        `CallAdapter` you can provide a survey, or other options for the user to provide feedback on the call. you can
        do that with the following code:
      </Description>
      <Source code={endCallSubscriptionText}></Source>
      <Heading>Cleaning up</Heading>
      <Description>
        After the call is over it is important to clean up the widget and make sure that the user is ready to start a
        new call. This includes disposing of the `CallAdapter` and setting the state of the widget to the appropriate
        mode. This is important so that the user is always ready to start a new call.
      </Description>
      <Description>
        Like in the section after the call to do this cleanup we want to take a look at the `onCallEnded` event to
        dispose the adapter and reset the widget state. This code snippet shows how to do that.
      </Description>
      <Source code={endCallAdapterDisposeText}></Source>
      <Heading>CallComposite Props</Heading>
      <Props of={CallComposite} />
    </div>
  );
};

const WidgetStory: () => JSX.Element = () => {
  return (
    <Stack style={{ width: '30rem', height: '30rem', position: 'relative' }}>
      <CallingWidgetComponentMock />
    </Stack>
  );
};

export const Widget = WidgetStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-internal-widget`,
  title: `${COMPOSITE_FOLDER_PREFIX}/internal/Widget`,
  component: CallComposite,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

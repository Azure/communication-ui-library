import { TeamsMeetingIdLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallAndChatLocator,
  CallWithChatComposite,
  useAzureCommunicationCallWithChatAdapter,
  CallWithChatCompositeOptions
} from '@azure/communication-react';
import { Theme, PartialTheme, Spinner, initializeIcons } from '@fluentui/react';
import React, { useMemo } from 'react';

initializeIcons();

export type CallWithChatExampleProps = {
  // Props needed for the construction of the CallWithChatAdapter
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  /**
   * For CallWithChat you need to provide either a teams meeting locator or a CallAndChat locator
   * for the composite
   *
   * CallAndChatLocator: This locator is comprised of a groupId call locator and a chat thread
   * threadId for the session. See documentation on the {@link CallAndChatLocator} to see types of calls supported.
   * {callLocator: ..., threadId: ...}
   *
   * TeamsMeetingLinkLocator: this is a special locator comprised of a Teams meeting link
   * {meetingLink: ...}
   */
  locator: TeamsMeetingLinkLocator | CallAndChatLocator | TeamsMeetingIdLocator;

  // Props to customize the CallWithChatComposite experience
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  compositeOptions?: CallWithChatCompositeOptions;
  callInvitationURL?: string;
  formFactor?: 'desktop' | 'mobile';
};

export const CallWithChatExperience = (props: CallWithChatExampleProps): JSX.Element => {
  // Construct a credential for the user with the token retrieved from your server. This credential
  // must be memoized to ensure useAzureCommunicationCallWithChatAdapter is not retriggered on every render pass.
  const credential = useMemo(() => new AzureCommunicationTokenCredential(props.token), [props.token]);

  // Create the adapter using a custom react hook provided in the @azure/communication-react package.
  // See https://aka.ms/acsstorybook?path=/docs/composite-adapters--page for more information on adapter construction and alternative constructors.
  const adapter = useAzureCommunicationCallWithChatAdapter({
    userId: props.userId,
    displayName: props.displayName,
    credential,
    locator: props.locator,
    endpoint: props.endpointUrl
  });

  // The adapter is created asynchronously by the useAzureCommunicationCallWithChatAdapter hook.
  // Here we show a spinner until the adapter has finished constructing.
  if (!adapter) {
    return <Spinner label="Initializing..." />;
  }

  return (
    <CallWithChatComposite
      adapter={adapter}
      fluentTheme={props.fluentTheme}
      rtl={props.rtl}
      formFactor={props.formFactor}
      joinInvitationURL={props.callInvitationURL}
      options={props.compositeOptions}
    />
  );
};
